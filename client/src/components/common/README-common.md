# Common

This folder contains all of the common components used throughout the app. There is no specific order or flow between these files, instead they all act as standalone components that can be used repeatedly.

## Animation Folder

The animation folder contains three files pertaining to animations used in our website: FadeIn.js, FadeOut.js, and LoadingDots.js. Uses for these files include:

- FadeIn and FadeOut were both supposed to be used in the Modal.js component found in the common folder. However, we decided to only use FadeIn.js and leave FadeOut.js since it seemed like too much. We kept the file for FadeOut.js in case we decided to use it elsewhere but that never occurred.
- LoadingDots are used within the courses folder for both creating and joining a course. Specifically, they are implemented using the common Button.js component

## Dropdown Folder

The dropdown folder contains three files pertaining to dropdown menus: ClickAway.js, Dropdown.js, and DropdownOption.js. Uses for these files include:

- ClickAway is used to disable the dropdown menu in the Dropdown component located within the Dropdown folder
- Dropdown is used for the profile logout in the TopNavBar.js component located in the navigation folder
- DropdownOption is used to add options to the dropdown menu in the Dropdown component

## Requests Folder

There are two files in this folder, Fetch.js and LazyFetch.js, that are both used extensively throughout this project. These files directly handle how we interact with the backend server. Files where these components are used include:

- Reaction.js located within this common folder
- Home.js located within the home folder
- Post.js located within the post folder
- PostView.js located within the post folder

These components should've also been used in JoinInfo.js, JoinConfirmation.js, and CourseInfo.js located within the courses folder. However, by the time we created the Fetch and LazyFetch files, these three components (JoinInfo, JoinConfirmation, and CourseInfo) were already implemented and we didn't have enough time to go back and refactor them.

## Remaining Files

The remaining components in this file are not grouped specifically but they are still common components used thruoughout our entire web app. The components include:

- Button.js which is used in the following files:
  - Comment.js
  - CommentReply.js
  - CommentView.js
  - CreateCourse.js
  - JoinCourse.js
  - CourseConfirmation.js
  - CourseInfo.js
  - JoinConfirmation.js
  - JoinInfo.js
  - Messages.js
  - Options.js
  - Post.js
  - PostView.js
- Checkbox.js which is used in Post.js and future files we will create
- DraftTextArea.js which is used in the following files:
  - CommentReply.js
  - Messages.js
  - Post.js
- Errors.js which is used in the following files:
  - CourseInfo.js
  - JoinConfirmation.js
  - JoinInfo.js
- Input.js which is used in the following files:
  - CourseConfirmation.js
  - CourseInfo.js
  - JoinInfo.js
  - Messages.js
- InputLabel.js which is used in the following files:
  - CourseConfirmation.js
  - CourseInfo.js
  - JoinInfo.js
- Modal.js which is used in the following files:
  - CreateCourse.js
  - JoinCourse.js
- Reaction.js which is used in the following files:
  - Comment.js
  - CommentReply.js
  - PostReactions.js
- SearchBar.js which is used in TopNavBar.js and future files we will create
- Select.js which is used in CouseInfo.js and future files we will create
