from flask import jsonify, request
from flask_restful import reqparse, Resource
from auth import current_user, permission_layer
from mongo import *
from utils.argparser_types import str2bool
from bson.json_util import dumps
from bson.objectid import ObjectId


class Posts(Resource):
    def post(self, course_id=None):
        course = current_user.get_course(course_id)
        if not course:
            return {"errors": ["You have not joined this course"]}, 403

        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('title')
        parser.add_argument('content')
        parser.add_argument('isPrivate', type=bool)
        parser.add_argument('isAnonymous', type=bool)
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_post(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # Check if user is instructor
        isInstructor = False
        if course.admin:
            isInstructor = True

        # Adding user info to dict
        anonymous = args['isAnonymous']
        if anonymous:
            postedby = {"first": "Anonymous", "last": "",
                        "_id": current_user.anonymousId, "anonymous": anonymous}
        else:
            postedby = {"first": current_user.first, "last": current_user.last,
                        "_id": current_user._id, "anonymous": anonymous, "picture": current_user.picture}

        # Add post to MongoDB
        post = Post(courseid=course_id, postedby=postedby, title=args.title,
                    isPrivate=args.isPrivate, content=args.content, isInstructor=isInstructor).save()

        # Get the JSON format
        result = self.serialize(post)

        return result, 200

    def get(self, course_id=None):
        # Get the search input and the current course
        req = request.args.get('search')
        page = request.args.get('page', default=0, type=int)
        # filter options: 'instructor', 'me', 'myupvoted'
        filterby = request.args.get('filterby', type=str)
        current_course = current_user.get_course(course_id)

        queryParams = {"courseid": course_id}
        # Filter by 'instructor'
        if filterby == 'instructor':
            queryParams["isInstructor"] = True
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", -1)]).skip(page * 20).limit(20)
        # Filter by 'me'
        elif filterby == 'me':
            queryParams["postedby._id"] = {
                '$in': [current_user._id, current_user.anonymousId]}
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", -1)]).skip(page * 20).limit(20)
        # Filter by 'myupvoted'
        elif filterby == 'myupvoted':
            queryParams["reactions.likes"] = current_user._id
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", -1)]).skip(page * 20).limit(20)
        # If the current user can see private posts and there's no search
        elif current_course.seePrivate and (req is None):
            query = Post.objects.raw(
                queryParams).order_by([("isPinned", -1), ("createdDate", -1)]).skip(page * 20).limit(20)

        # If the current user can see private posts and there is a search
        elif current_course.seePrivate and (req is not None):
            queryParams['$text'] = {'$search': req}
            query = Post.objects.raw(queryParams).order_by(
                [("isPinned", -1), ("createdDate", -1)]).skip(page * 20).limit(20)

        # If the current user cannot see private posts and there is a search
        elif (not current_course.seePrivate) and (req is not None):
            queryParams['$or'] = [{'isPrivate': False}, {'postedby._id': {
                '$in': [current_user._id, current_user.anonymousId]}}]
            queryParams['$text'] = {'$search': req}
            query = Post.objects.raw(queryParams).order_by(
                [('isPinned', -1), ('createdDate', -1)]).skip(page * 20).limit(20)

        # If the current user cannot see private posts and there is not a search
        else:
            queryParams["$or"] = [{'isPrivate': False}, {'postedby._id': {
                '$in': [current_user._id, current_user.anonymousId]}}]
            query = Post.objects.raw(queryParams).order_by(
                [("isPinned", -1), ("createdDate", -1)]).skip(page * 20).limit(20)

        # Get the json for all the posts we want to display
        result = [self.serialize(post) for post in query]

        return result, 200

    def delete(self, course_id=None):
        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('_id')
        args = parser.parse_args()

        # Get the post you want to delete
        query = Post.objects.raw({'_id': args['_id']})
        post = query.first()

        # Count how many posts had same id for error checking and handle appropriately
        count = query.count()

        if count > 1:
            raise Exception(
                f'Duplicate post detected, multiple posts in database with id {_id}')
        elif count == 1:
            # Get the current course
            current_course = current_user.get_course(course_id)
            # Permission check
            if current_user._id == post.postedby['_id'] or current_user.anonymousId == post.postedby['_id'] or current_course.admin:
                # Delete the post
                post.delete()
                return {'deleted': True}, 200
            else:
                return {'deleted': False}, 403
        else:
            raise Exception(f'No post with id')

    def put(self, course_id):
        # Parse the request
        parser = reqparse.RequestParser()
        parser.add_argument('title')
        parser.add_argument('content')
        parser.add_argument('isPinned', type=bool)
        parser.add_argument('_id')
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_post(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # Query for the post and get the current course
        query = Post.objects.raw({'_id': args["_id"]})
        current_course = current_user.get_course(course_id)

        # Count how many posts had same id for error checking and handle appropriately
        count = query.count()
        if count > 1:
            raise Exception(
                f'Duplicate post detected, multiple posts in database with id {args["_id"]}')
        elif count == 1:
            post = query.first()
            id_match = current_user._id == post.postedby[
                '_id'] or current_user.anonymousId == post.postedby['_id']
            if id_match or current_course.admin:
                post.title = args['title']
                post.content = args['content']
                post.updatedDate = datetime.datetime.now()
                if current_course.canPin:
                    post.isPinned = args['isPinned']
                post.save()
                result = self.serialize(post)
                return result, 200
        else:
            raise Exception(f'No post with id')

    def validate_post(self, args):
        errors = []
        if args.title is None:
            errors.append("Please give your message a title")
        if args.content is None:
            errors.append("Please give your message content")
        return errors

    def serialize(self, post):
        # Get the JSON format
        result = post.to_son()

        # Convert datetime to a string
        date = str(result['createdDate'])
        result['createdDate'] = date

        date = str(result['updatedDate'])
        result['updatedDate'] = date
        return result
