from flask import jsonify
from flask_restful import Resource, abort, reqparse
from auth import current_user, permission_layer
from mongo import *
from socketio_app import io


class Comments(Resource):
    def get(self, post_id=None):
        # Get all comments on post
        post = self.retrieve_post(post_id)
        if post is None:
            return abort(400, errors=["Bad post id"])

        return [self.serialize(comment) for comment in Comment.objects.raw({'post_id': post_id})]

    def post(self, post_id=None):
        # Add comment to post
        # Retrieving post
        print("here")
        post = self.retrieve_post(post_id)
        if post is None:
            return abort(400, errors=["Bad post id"])
        parser = reqparse.RequestParser()
        parser.add_argument('content')
        parser.add_argument('isAnonymous', type=bool)
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_comment(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # Adding user info to dict
        anonymous = args['isAnonymous']
        if anonymous:
            postedby = {"first": "Anonymous", "last": "",
                        "_id": current_user.anonymousId, "anonymous": anonymous}
        else:
            postedby = {"first": current_user.first, "last": current_user.last,
                        "_id": current_user._id, "anonymous": anonymous, "picture": current_user.picture}

        # Add post to MongoDB
        comment = Comment(post_id=post_id, postedby=postedby,
                          content=args.content).save()

        # Incrementing post comment count, updating date
        post.updatedDate = datetime.datetime.now()
        post.comments += 1
        post.save()
        result = self.serialize(comment)
        io.emit('Comment/create', result, room=post_id)
        return result, 200

    def put(self, post_id=None):
        # Update comment
        # Parse the request
        post = self.retrieve_post(post_id)

        parser = reqparse.RequestParser()
        parser.add_argument('content')
        parser.add_argument('_id')
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_comment(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        current_course = current_user.get_course(post.courseid)
        _id = ObjectId(args['_id'])
        query = Comment.objects.raw({'_id': _id})
        count = query.count()
        if count > 1:
            raise Exception(
                f'Duplicate comment detected, multiple comments in database with id {args["_id"]}')
        elif count == 1:
            comment = query.first()
            id_match = current_user._id == comment.postedby[
                '_id'] or current_user.anonymousId == comment.postedby['_id']
            if id_match or current_course.admin:
                comment.content = args['content']
                post.updatedDate = datetime.datetime.now()
                comment.save()
                post.save()
                result = self.serialize(comment)
                return result, 200
        else:
            raise Exception(f'No comment with id')

    def delete(self, post_id=None):
        # Delete comment
        # Grabbing comment id
        post = self.retrieve_post(post_id)
        parser = reqparse.RequestParser()
        parser.add_argument('_id')
        args = parser.parse_args()

        if args['_id'] is None:
            return abort(400, errors=["No comment id"])

        _id = ObjectId(args['_id'])
        query = Comment.objects.raw({'_id': _id})
        count = query.count()
        if count > 1:
            raise Exception(
                f'Duplicate comment detected, multiple comments in database with id {args["_id"]}')
        elif count == 1:
            # Get the current course
            current_course = current_user.get_course(course_id)
            # Permission check
            comment = query.first()
            id_match = current_user._id == comment.postedby[
                '_id'] or current_user.anonymousId == comment.postedby['_id']
            if id_match or current_course.admin:
                post.comments -= 1
                post.save()
                comment.delete()
                return {'deleted': True}, 200
            else:
                return {'deleted': False}, 403
        else:
            raise Exception(f'No comment with id')

    def validate_comment(self, args):
        errors = []
        if args.content is None:
            errors.append("Please give your comment content")
        return errors

    def retrieve_post(self, post_id):
        query = Post.objects.raw({'_id': post_id})
        count = query.count()
        if count == 1:
            return query.first()
        elif count == 0:
            return None
        else:
            raise Exception(
                f'Multiple posts with the same id found, id: {post_id}')

    def serialize(self, comment):
        d = comment.to_son().to_dict()
        d['_id'] = str(d['_id'])
        return d
