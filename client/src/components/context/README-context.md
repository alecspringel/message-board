# Context

This folder contains a single file pertaining to the use of the User context for fetching and using User related data.

## User-backend Model

```json
{
  "_id": "115987172556120960410",
  "anonymousId": "7hzfKLnMhjCZn8UtjKJXGJy",
  "email": "user.email@email.com",
  "first": "First Name",
  "last": "Last Name",
  "picture": "url to the user profile image",
  "courses": [],
  "_cls": "mongo.User"
}
```

### Use

This model reference is used in the following files to obtain user information:

- App.js
- Comment.js
- CommentReply.js
- CommentView.js
- Reaction.js
- UserProvider.js
- Courses.js
- CourseInfo.js
- ProfileDropdown.js
- Post.js
- Sidebar.js

#### Examples

```js
import { UserProvider } from "local/import/path";

const user = useContext(UserContext);

console.log(user);
console.log(user.first, " ", user.last);
```
