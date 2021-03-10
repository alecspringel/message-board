from flask_restful import reqparse, Resource
from flask import request
from enum import Enum
from mongo import *
from utils.argparser_types import str2bool
from auth import permission_layer, current_user
from config import DEFAULT_COLORS
import random


# Courses
# POST - Handles course creation
# Access - Instructor Only


class Courses(Resource):
    @permission_layer([])
    def post(self):
        # Get json for POST requests
        request.get_json(force=True)
        # Parse arguments
        parser = reqparse.RequestParser()
        # parser.add_argument('university')
        parser.add_argument('course')
        parser.add_argument('canJoinById', type=str2bool, default=True)
        parser.add_argument('color')
        args = parser.parse_args()

        # Validate the args
        errors = self.validate_post(args)
        # Return the failed request with errors if errors exist
        if(bool(errors)):
            return {"errors": errors}, 400

        # Picking user course color
        if args['color'] is None:
            color = pick_color(DEFAULT_COLORS)
        else:
            color = args['color']
        print(color, args['color'])
        # Add the course to the user's course list and create the course
        course = Course(course=args.course,
                        canJoinById=args.canJoinById, instructorID=current_user._id).save()

        # Appends the course with permissions to the user who created it
        User.objects.raw({'_id': current_user._id}).update({"$push": {"courses":
                                                                      {"course_id": course._id, "course_name": args.course,
                                                                       "canPost": True, "seePrivate": True, "canPin": True,
                                                                       "canRemove": True, "canEndorse": True, "viewAnonymous": True,
                                                                       "admin": True, "color": color}}})
        return {"_id": course._id, "course": course.course, "color": color}, 200

    def delete(self):
        # Parse argument
        courseid = request.args.get('courseid')
        # Query for courses matching the courseid
        query = Course.objects.raw({"_id": courseid})
        # Error checking even though these shouldn't happen
        count = query.count()
        if count > 1:
            return {"errors": [f"More than one course with id {courseid}"]}, 400
        elif count == 0:
            return {"errors": [f"No course with id {courseid}"]}, 400
        # Get the course to delete
        course = query.first()
        # Check permissions
        if current_user._id != course.instructorID:
            return {"errors": ["Access denied"]}, 400
        # Remove the course from the user's course list
        User.objects.raw({"_id": current_user._id}).update(
            {"$pull": {"courses": {"course_id": courseid}}})

        # Delete all posts associated with the course
        post_query = Post.objects.raw({"courseid": courseid})
        posts = list(post_query)
        for post in posts:
            # Delete all comments associated with each post in the course
            comment_query = Comment.objects.raw({"post_id": post._id})
            count = comment_query.count()
            comments = list(comment_query)
            for comment in comments:
                post.comments -= 1
                comment.delete()
            post.delete()

        # Delete the course itself
        course.delete()
        return {"success": "successful delete"}

    def validate_post(self, args):
        errors = []
        # if args.university is None:
        #     errors.append("University not specified")
        if args.course is None:
            errors.append("Please specify a course name")
        if args.canJoinById is None:
            errors.append("Please specify if the course is joinable by id")
        return errors


def pick_color(colors, default="#162B55"):
    existing_course_colors = []
    for course in current_user.courses:
        existing_course_colors.append(course.color)

    attempt_counter = 0
    while True and attempt_counter < 100:
        attempt_counter += 1
        choice = random.choice(colors)
        if choice not in existing_course_colors:
            break
    if attempt_counter == 100:
        choice = default
    return choice
