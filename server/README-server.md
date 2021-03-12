# Server

The server folder contains four main files for backend management and two extra folders to keep things organized. The extra folders have their own READMEs so in this README we will just discuss the four main files: app.py, auth.py, config.py, and mongo.py.

## App

Much like App.js on the frontend, app.py handles putting all of the backend together so that the server can run. This component handles request messages, secret key configuration, oauth routes, and linking paths for resources.

## Auth

This component contains functions used to perform user authentication, and secure the rest api.

Users login with their Google or GitHub accounts using the OAuth2 protocol. Once users are logged in they are issued a JWT that continuously identifies them until the token expires. Then, when users send a request to the rest api, the JWT is checked for authorization.

## Config

The config component handles linking all of our environment variables and general configuration components. This includes a list of default colors we use in the app for creating course cards.

## Mongo

This component handles setting up all of our MongoDB models so that each collection has the correct fields and default values. The model format is as follows:

### Post Model

```json
{
  "_id": "oasif-jo12j-asdjf-asdf9",
  "courseid": "vonqJNDJ07yPyiagvKlR",
  "postedby": {
    "first": "Alec",
    "last": "Springel",
    "_id": "oasif-jo12j-asdjf-asdf9",
    "anonymous": false,
    "picture": "profile-picture-url.com"
  },
  "title": "example",
  "content": "example content",
  "isPrivate": false,
  "isPinned": false,
  "instructorCommented": false,
  "reactions": {
    "likes": ["userid123"]
  },
  "comments": 3,
  "createdDate": "2021-03-08 17:46:53.289000",
  "updatedDate": "2021-03-08 18:26:33.128000"
}
```

### Comment Model

```json
{
  "_id": "oasif-jo12j-asdjf-asdf9",
  "post_id": "oasif-jo12j-asdjf-asdf9",
  "content": "Your question is stupid",
  "postedby": {
    "first": "Alec",
    "last": "Springel",
    "_id": "oasif-jo12j-asdjf-asdf9",
    "anonymous": false,
    "picture": "profile-picture-url.com"
  },
  "endorsed": false,
  "replies": [
    {
      "_id": "oasif-jo12j-asdjf-asdf9",
      "content": "",
      "postedBy": {
        "first": "Alec",
        "last": "Springel",
        "_id": "oasif-jo12j-asdjf-asdf9",
        "anonymous": false,
        "picture": "profile-picture-url.com"
      },
      "reactions": {
        "likes": ["userid123"]
      }
    }
  ],
  "reactions": {
    "likes": ["userid123"]
  }
}
```

### Course Model

```json
{
  "_id": "shortId_abJl3S",
  "course": "CIS 210",
  "canJoinById": true,
  "instructorID": "oasif-jo12j-asdjf-asdf9"
}
```

### User Model

```json
{
  "_id": "oasif-jo12j-asdjf-asdf9",
  "anonymousId": "cuk19-lzi91-soc01-cks83",
  "picture": "https://google.com/users/images/aobidsl123",
  "first": "Alec",
  "last": "Springel",
  "email": "alecspringel@gmail.com",
  "courses": [
    {
      "course_id": "oasif-jo12j-asdjf-asdf9",
      "course_name": "CIS 210",
      "nickname": null,
      "color": "#3e7aab",
      "canPost": true,
      "seePrivate": false,
      "canPin": false,
      "canRemove": false,
      "canEndorse": false,
      "viewAnonymous": false,
      "admin": false
    }
  ]
}
```
