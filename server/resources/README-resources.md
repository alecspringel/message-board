# Resources

This folder contains all of the backend resources used in our web app. These directly communicate with the frontend to handle general create, read, udpdate, and delete (CRUD) operations through the form of GET, PUT, POST, and DELETE request handlers. Not every resource uses all four operations but you will find an occurrence of at least one throughout all of these files. These resources also handle error checking and reply with correct

## Comments Resource

The comment resource handles GET, PUT, POST, and DELETE requests for user created comments. It works directly with the CommentView.js file on the frontend for both POST requests and GET requests. The functionality for PUT and DELETE requests has not yet been implemented in the frontend but when it is, PUT will be used for editing comments and DELETE will be used for deleting comments.

## Course Resource

The course resource handles POST requests for creating a new course. It works directly with CourseInfo.js on the frontend so that we can get user input for the course name.

## Home Resource

The home resource handles GET requests for obtaining the 20 most recent posts over all of a users courses. It sends this information directly to Home.js on the frontend so that it can be displayed to the user.

## Join Resource

The join resource handles POST and PUT requests for joining an existing course. The POST request is used to obtain the course's id, name, and instructor's first and last name and is then sent to JoinInfo.js for it to be displayed in the JoinConfirmation.js. Once a user confirms joining a course, JoinConfirmation.js will send a PUT request to the join resource so that the user's courses can be updated. The data sent back to the frontend from the PUT request is used to populate the course card that get's created.

## Me Resource

The me resource handles the GET request for obtaining all info related to the current user. It works directly with PrivateRoute.js on the frontend so that we can check credentials consistently while a user navigates our website.

## Posts Resource

The post resource handles GET, PUT, POST, and DELETE requests for user created posts. It works directly with the Post.js file on the frontend for POST requests and PostView.js for GET requests. The functionality for PUT and DELETE requests has not yet been implemented in the frontend but when it is PUT will be used for editing posts and DELETE will be used for deleting posts.

## Reactions Resource

The reactions resource handles PUT requests for updating reactions. This resource works directly with Reaction.js in the frontend. Currently, the only reactions we have are likes but we intend to add more in the future.

## Replies Resource

The replies resource handles POST, PUT, and DELETE requests. Here we don't need a GET request since replies are an embedded field within our comments resource. This resource works directly with Comment.js on the frontend for POST requests. The functionality for PUT and DELETE requests has not yet been implemented in the frontend but when it is, PUT will be used for editing replies and DELETE will be used for deleting replies.
