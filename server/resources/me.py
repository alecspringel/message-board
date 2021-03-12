from flask import jsonify
from flask_restful import Resource, reqparse
from auth import current_user, permission_layer
from mongo import *


class Me(Resource):
    @permission_layer([])
    def get(self):
        """
        Retrieves the current user
        ---
        tags:
          - User
        definitions:
          User:
            type: object
            properties:
              sub:
                type: string
                description: Unique user identifier
                example: abcde12345
              email:
                type: string
                description: Email address
                example: cyrilfiggis@gmail.com
              first:
                type: string
                description: First name
                example: Cyril
              last:
                type: string
                description: Last name
                example: Figgis
              instructor:
                type: boolean
                default: false
                description: Boolean representing if the user is an instructor on the platform
                example: cyrilfiggis@gmail.com
              permissions:
                type: array
                items:
                  $ref: '#/definitions/CoursePermissions'

          CoursePermissions:
            type: object
            properties:
              course_id:
                type: string
                description: ID of the course these permissions are for
                example: vytxeTZskVKR7C7WgdSP3d
              post_question:
                type: boolean
                description: If the user is allowed to post a question
                default: true
                example: true
              create_announcement:
                type: boolean
                description: If the user is allowed to post an announcement
                default: false
                example: false
              post_response:
                type: boolean
                description: If the user is allowed to post a response to another post
                default: true
                example: true
          403Message:
            type: object
            properties:
              msg:
                type: string
                description: Reason the request did not succeed or was rejected
                example: "Resource access restricted"

        responses:
          200:
            description: Stored user data for the currently logged in user
            schema:
              $ref: '#/definitions/User'
          403:
            description: Unable to retrieve current user data
            schema:
              $ref: '#/definitions/403Message'



        """
        return current_user.to_son().to_dict()
