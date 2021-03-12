from flask import jsonify
from flask_restful import Resource, abort, reqparse
from auth import current_user, permission_layer
from mongo import *
from socketio_app import io


class Replies(Resource):
    def post(self, post_id=None, comment_id=None):
        # Add comment to post
        # Retrieving post
        post = self.retrieve_post(post_id)
        if post is None:
            return abort(400, errors=["Bad post id"])
        parser = reqparse.RequestParser()
        parser.add_argument('content')
        parser.add_argument('isAnonymous', type=bool)
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_reply(args)
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

        # Add reply to MongoDB and retrieve the comment
        reply = Reply(postedby=postedby, content=args.content)
        comment = self.retrieve_comment(comment_id)

        # Append reply to the comment and save it to the database
        comment.replies.append(reply)
        comment.save()

        # Updating date and saving to database
        post.updatedDate = datetime.datetime.now()
        post.save()
        result = self.serialize(reply)
        io.emit('Reply/create', self.serialize(comment), room=post_id)
        return result, 200

    def put(self, post_id=None, comment_id=None):
        # Update comment
        post = self.retrieve_post(post_id)

        # Parse the request
        parser = reqparse.RequestParser()
        parser.add_argument('content')
        parser.add_argument('_id')
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_reply(args)
        if(bool(errors)):
            return {"errors": errors}, 400

        # Get the current course and retrieve the comment
        current_course = current_user.get_course(post.courseid)
        comment = self.retrieve_comment(comment_id)

        # Get the reply we're looking for
        reply = None
        for reply in comment.replies:
            if reply._id == args['_id']:
                break

        # Error checking
        if reply is None:
            return {'deleted': False}, 403

        # Permissions check
        id_match = current_user._id == reply.postedby[
            '_id'] or current_user.anonymousId == reply.postedby['_id']
        if id_match or current_course.admin:
            reply.content = args['content']
            comment.save()
            result = self.serialize(comment)
            return result, 200

    def delete(self, post_id=None, comment_id=None):
        # Delete comment
        post = self.retrieve_post(post_id)

        # Grabbing comment id
        parser = reqparse.RequestParser()
        parser.add_argument('_id')
        args = parser.parse_args()

        if args['_id'] is None:
            return abort(400, errors=["No comment id"])

        comment = self.retrieve_comment(comment_id)
        # Get the current course
        current_course = current_user.get_course(post.courseid)

        # Get the reply we're looking for
        reply = None
        for reply in comment.replies:
            if reply._id == args['_id']:
                break

        # Error checking
        if reply is None:
            return {'deleted': False}, 403

        # Permission check
        id_match = current_user._id == reply.postedby[
            '_id'] or current_user.anonymousId == reply.postedby['_id']
        if id_match or current_course.admin:
            comment.replies.remove(reply)
            comment.save()
            return {'deleted': True}, 200
        else:
            return {'deleted': False}, 403

    def validate_reply(self, args):
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

    def retrieve_comment(self, comment_id):
        _id = ObjectId(comment_id)
        query = Comment.objects.raw({'_id': _id})
        count = query.count()
        if count == 1:
            return query.first()
        elif count == 0:
            return None
        else:
            raise Exception(
                f'Multiple comments with the same id found, id: {comment_id}')

    def serialize(self, comment):
        d = comment.to_son().to_dict()
        d['_id'] = str(d['_id'])
        return d
