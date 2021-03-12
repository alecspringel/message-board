# Courses

This folder contains the components related to displaying course cards and joining/creating a course.

## High Level Overview

When a user clicks on the courses tab it will show them a page displaying all of their current courses in a card-view format. Above that it will also show them two buttons for joining a course and for creating a course. The high level overview of this display format is what's contained in Courses.js. Within that file are two more components called CourseCard.js and TopContent.js. These files create the course cards to display and the buttons above them, respectively.

## Joining a Course

There is a flow between components when a user wants to join a course which is as follows:

1. The user will see a button called "Join a Course" which will be located in the TopContent component
2. The click on this button is handled in the JoinCourse component and will then display the Modal component from the common folder
3. The first page of the Modal component displays a form-like setting which is handled within the JoinInfo component located in the joinCourse folder
4. Once the user enters information into either of the input boxes and clicks the "+ Join Course" button, the request is sent to the backend so that information about the course can be seen on the next page
5. The second page of the Modal component is then displayed with the information received from the backend. This second page is handled within the JoinConfirmation component located in the joinCourse folder. From here the user has two options:
   1. Clicking the "Back" button will take you back to step 3
   2. Clicking the "Confirm" button will send a request to the backend to place the user in the correct class. This will then send a confirmation back to the frontend and take you to step 6
6. Upon receiving the confirmation, the React state will be updated to display the new course card on the page

## Creating a Course

Much like joining a course, there is also a flow between components when a user wants to create a course:

1. The user will see a button called "Create a Course" which will be located in the TopContent component
2. The click on this button is handled in the CreateCourse component and will then display the Modal component from the common folder
3. The first page of the Modal component displays a form-like setting which is handled within the CourseInfo component located in the createCourse folder
4. Once the user enters a course name and clicks the "+ Create Course" button, the request is sent to the backend to create a new course in the database and make the user who created it the instructor
5. The second page of the Modal component is then displayed showing an invite link and an access code for other people to join the course. This is handled in the CourseConfirmation component located in the createCourse folder
6. When the user cicks the "Okay!" button, the React state is updated and the new course card is displayed on the page
