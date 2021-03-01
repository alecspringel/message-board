"""
Contains functions used to perform user authentication, and secure the rest api.
Authors: Sam Peters

Users login with their google accounts
This is done through the OAuth2 protocol
Once users are logged in they are issued a JWT that continuously identifies them until the token expires
When users send a request to the rest api, the JWT is checked for authorization

Steps:
1. Set up oauth login flow through google.
2. Be able to retrieve user account details from google using oath token
3. Assign users a jwt at the point of login
4. Check jwt on api requests
5. lookup user using jwt details on api requests
"""
from werkzeug.local import LocalProxy
from mongo import *
from config import HS_256_KEY, CLIENT_URL
from functools import wraps
import sys
import logging
from authlib.integrations.flask_client import OAuth
from authlib.jose import jwt
from flask import Blueprint, session, url_for, redirect, request, make_response, jsonify, g, current_app
from flask_restful import abort


# Authlib logging
log = logging.getLogger('authlib')
log.addHandler(logging.StreamHandler(sys.stdout))
log.setLevel(logging.DEBUG)

# Blueprint stores authentication related routes
auth_routes = Blueprint('auth_blueprint', __name__)
# OAuth object implements OAuth 2.0 protocol logic
# configured in app.py
oauth = OAuth()


def get_current_user():
    """
    Sets g.current in the current app context.

    Returns:
        User/None: MongoDB object representing request sending user
    """
    if 'current_user' not in g:
        user = None
        cookie = request.cookies.get('userID')
        if cookie:
            payload = decode_jwt(cookie)
            _id = payload['_id']
            user = retrieve_user(_id)
        g.current_user = user

    return g.current_user


# Allows you to use current_user as a variable in any flask route
current_user = LocalProxy(get_current_user)


def teardown_current_user(exception):
    """
    Removes the current_user variable from the app_context.

    Assigned as a teardown funtion for the app variable in app.py
    Args:
        exception (Exception): Any exception that might occur while executing a route function
    """
    user = g.pop('current_user', None)


def permission_layer(required_permissions: list, requireInstructor=False):
    """
    Checks if the current_user has the correct permissions to access the endpoint
    for the given course
    Args:
        permissions (List[str]): permission required to access endpoint
    """
    def actual_decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Checking if user is not logged in when it's required they are
            if current_user == None and (required_permissions or requireInstructor):
                abort(401, errors=[
                      "Resource access restricted: unauthorized client"])
            # Checking if the user has the required course specific permissions
            if required_permissions:
                course_id = kwargs.get('course_id')
                if course_id is None:
                    raise Exception(
                        f'course_id not specified in url path of request to endpoint that requires course based permissions')
                course = current_user.get_course(course_id)
                for permission in required_permissions:
                    user_perm = getattr(current_user, permission, False)
                    if not user_perm:
                        return abort(403, errrors=["Resource access restricted"])
            # Checking if the user is an instructor when it's required
            if requireInstructor:
                university_name = kwargs.get('university_name')
                if university_name is None:
                    raise Exception(
                        f'university_name not specified in url path of request to endpoint that requires course based permissions')
                university = current_user.get_university(university_name)
                if not university.instructor:
                    return abort(403, errrors=["Resource access restricted"])
            # Running the actual route function
            return func(*args, **kwargs)
        return wrapper
    return actual_decorator


@ auth_routes.route('/testauthsuccess')
@ permission_layer(["read", "write"], "course_id_1")
def testauthsuccess():
    return jsonify(message="Congrats, you have access to this resource"), 200


@ auth_routes.route('/testauthfail')
@ permission_layer(["admin", "write"], "course_id_1")
def testauthfail():
    return jsonify(message="Congrats, you have access to this resource"), 200


@ auth_routes.route('/login')
def login():
    redirect_uri = url_for('auth_blueprint.auth', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)


@ auth_routes.route('/logout')
def logout():
    resp = make_response(redirect(CLIENT_URL))
    resp.set_cookie('userID', value="", expires=0)
    return resp


@ auth_routes.route('/auth')
def auth():
    token = oauth.google.authorize_access_token()
    id_token = oauth.google.parse_id_token(token)
    _id = id_token['sub']
    user = retrieve_user(_id)
    # If a user wasn't found
    if not user:
        user = create_user(id_token)

    # Create a new response
    resp = make_response(redirect(CLIENT_URL))
    # cookie_age is the number of seconds the cookie lives before becoming invalid
    cookie_age = 60 * 60 * 24
    # Encode the user's sub (unique google account identifier) in a JWT), and set that as a cookie attached to the response
    resp.set_cookie(
        'userID', value=encode_jwt({'_id': _id}), httponly=True, max_age=cookie_age)
    print(resp)
    # Redirect user to /testauth where cookie is retrieved and jwt is encoded to get at the sub # inside.
    # Planning on using sub # to retrieve user object from mongo
    return resp


def encode_jwt(payload):
    header = {'alg': 'HS256'}
    return jwt.encode(header, payload, HS_256_KEY)


def decode_jwt(s):
    return jwt.decode(s, HS_256_KEY)


def retrieve_user(_id):
    '''Retrieves the user from the database using the google "sub" field as _id'''
    query = User.objects.raw({'_id': _id})
    count = query.count()
    if count > 1:
        raise Exception(
            f'Duplicate user detected, multiple users in database with id {sub}')
    elif count == 1:
        return query.first()
    else:
        return None


def create_user(id_token):
    print(id_token)
    user = User(_id=id_token['sub'], first=id_token['given_name'], last=id_token['family_name'],
                email=id_token['email'], picture=id_token['picture']).save()
    return user
