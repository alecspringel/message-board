# Post

This folder contains all of the components related to Posts, as well as the course view where posts are displayed. Posts are also used in the comment view and home page, but most post related components are contained here.

## Files and thier uses

- ClassView.js
- Options.js used in:
  - Select.js
  - Dropdown.js
  - CourseInfo.js
  - PostView.js
- Post.js used in:
  - Comment.js
  - CommentView.js
  - Home.js
  - ClassView.js
  - PostView.js
- PostReactions.js used in:
  - Post.js
- PostView.js used in:
  - ClassView.js
- SectionTab.js used in:
  - Sidbar.js
  - ClassView.js
- Sidebar.js used in:
  - CommentView.js
  - ClassView.js

### Post.js

Posts are structured like so:

```js
return (
  <PostWrapper
    isCondensed={isCondensed}
    isFocused={postid}
    onClick={navigateToPost}
  >
    <PostTitle isCondensed={isCondensed}>{render.title} </PostTitle>
    <PinIcon isPinned={render.isPinned} src={PinImg} />
    {!isCondensed && <PostContent>{render.content}</PostContent>}
    {!isCondensed && <hr style={HRStyle} />}
    <PostMetaContentWrapper className="meta">
      {render.picture ? <UserIcon src={render.picture} /> : null}
      <UserDescription>Posted by {render.postedby}</UserDescription>
      <MetaIconWrapper>
        {render.isAnonymous}
        {render.isPrivate}
        {render.meta}
      </MetaIconWrapper>
    </PostMetaContentWrapper>
  </PostWrapper>
);
```
