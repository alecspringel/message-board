# Home

This folder pertains to the files associated with displaying the n most recent posts onto the home page grouped by course.

---

## Home.js

Home.js is where all of the content for the home page get stored. Home.js sents a get request to the backend server and grabs the 20 most recent posts. The data is sent as a json object, from which the RecentGroup component is dynamically generated.

```js
// Create a group of posts with the RecentGroup component
const createGroup = (postList, classroomName, nameColor) => {
  return (
    <RecentGroup
      postList={postList}
      classroomName={classroomName}
      nameColor={nameColor}
    />
  );
};
```

Along with these RecentGroup components, a list of post components is passed to each group to be displayed inside of them.

```js
// Create the post using the Post component
const createPost = (post) => {
  return <Post post={post} key={post._id} isCondensed={false} />;
};
```
