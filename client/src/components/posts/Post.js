import React, { useContext, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import PinImg from "../../imgs/pin.svg";
import { Link, useParams } from "react-router-dom";
import DraftTextArea from "../common/DraftTextArea";
import { UserContext } from "../context/UserProvider";
import { useHistory } from "react-router-dom";
import PostReactions from "./PostReactions";
import Button from "../common/Button";
import LazyFetch from "../common/requests/LazyFetch";
import Checkbox from "../common/Checkbox";
import { MDBCheckbox } from "mdb-react-ui-kit";

// Checks props to determine if the post is a draft, isPinned, etc.
const generatePostContent = (
  user,
  post,
  isDraft,
  handleChange,
  handleSubmit,
  postid,
  isAnon,
  isPriv
) => {
  // If a post is passed, set all dynamic content accordingly, otherwise render a draft
  if (isDraft) {
    return {
      title: (
        <DraftTextArea
          minRows={1}
          placeholder="Post title"
          onChange={handleChange}
          name="title"
        />
      ),
      content: (
        <DraftTextArea
          secondary
          placeholder="Details"
          onChange={handleChange}
          name="content"
        />
      ),
      to: null,
      isPinned: false,
      picture: user.picture,
      postedby: user.first + " " + user.last,
      meta: (
        <Button primary onClick={handleSubmit}>
          Submit
        </Button>
      ),
      isAnonymous: (
        <Checkbox
          checkboxName="isAnonymous"
          labelText={"Make Anonymous"}
          onChange={handleChange}
          checkStatus={isAnon}
        />
      ),
      isPrivate: (
        <Checkbox
          checkboxName="isPrivate"
          labelText={"Make Private"}
          onChange={handleChange}
          checkStatus={isPriv}
        />
      ),
    };
  } else {
    return {
      title: post.title,
      content: post.content,
      to: {
        pathname: "/course/" + post.courseid + "/post/" + post._id,
        state: { post },
      },
      isPinned: post.isPinned,
      picture: post.postedby.picture,
      postedby: post.postedby.first + " " + post.postedby.last,
      meta: <PostReactions post={post} postid={postid} />,
    };
  }
};

const Post = ({ post, isCondensed, isDraft }) => {
  const history = useHistory();
  const user = useContext(UserContext);
  const { courseid, postid } = useParams();

  // State and handler for drafting posts
  const [draft, setDraft] = useState({
    title: "",
    content: "",
    isAnonymous: false,
    isPrivate: false,
  });

  const handleChange = (e) => {
    setDraft({
      ...draft,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  // console.log(draft);

  const handleSubmit = (e) => {
    LazyFetch({
      type: "post",
      endpoint: "/api/courses/" + courseid + "/posts",
      data: {
        title: draft.title,
        content: draft.content,
        isPrivate: draft.isPrivate,
        isAnonymous: draft.isAnonymous,
      },
      onSuccess: (data) => {
        /* data.new is used after the redirect to prevent 
        a request for comments (new posts have 0 comments)*/
        data.new = true;
        // console.log(data);
        history.push({
          pathname: "/course/" + data.courseid + "/post/" + data._id,
          state: { post: data },
        });
      },
    });
  };

  if (draft != null) {
    var isAnon = draft.isAnonymous;
    var isPriv = draft.isPrivate;
  } else {
    isAnon = false;
    isPriv = false;
  }

  // Determines if post is a draft or not and renders accordingly:
  let render = generatePostContent(
    user,
    post,
    isDraft,
    handleChange,
    handleSubmit,
    postid,
    isAnon,
    isPriv
  );

  // Handles redirect if the post is not a draft
  const navigateToPost = () => {
    if (render.to) {
      history.push(render.to);
    }
  };

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
          {/* {isDraft == true ? (
            <Checkbox labelText={"isAnonymous"} onChange={handleChange} />
          ) : null}
          {isDraft == true ? (
            <Checkbox labelText={"isPrivate"} onChange={handleChange} />
          ) : null} */}
          {render.isAnonymous}
          {render.isPrivate}
          {render.meta}
        </MetaIconWrapper>
      </PostMetaContentWrapper>
    </PostWrapper>
  );
};

export default Post;

const HRStyle = {
  width: "100%",
  border: "1px solid #DDDDDD",
  margin: "16px 0",
};

//#region Post Stylings
const PostWrapper = styled.div`
  position: relative;
  padding: 23px 30px;
  display: flex;
  flex-direction: column;
  flex: 1;
  text-decoration: none;
  width: 100%;
  min-height: 85px;
  margin: 2em 0;
  border-radius: 0.3em;
  background: #fff;
  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
  transition: all 100ms ease-in-out;
  ${(props) =>
    !props.isFocused &&
    css`
      &:hover {
        box-shadow: 0px 3px 10px 3px rgb(0 0 0 / 7%);
      }
    `}
`;

const PostTitle = styled.h2`
  /* margin: 1em 0 0.5em 2em; */
  font-size: ${(props) => (!props.isCondensed && "18px") || "14px"};

  ${(props) =>
    !props.isCondensed ? "&:hover {text-decoration: underline}" : ""};
`;

const PinIcon = styled.img`
  visibility: ${(props) => (props.isPinned ? "visible" : "hidden")};
  position: absolute;
  top: 0;
  right: 0;
  width: 16px;
  height: 16px;
  margin: 1.1em 2em 0 0;
`;

const PostContent = styled.p`
  margin-top: 10px;
  font-size: 16px;
  color: #979797;
`;

const PostMetaContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;

const UserIcon = styled.img`
  float: left;
  width: 30px;
  height: 30px;
  margin-right: 0.5em;
  border-radius: 50%;
  user-select: none;
`;

const UserDescription = styled.h5`
  user-select: none;
`;

const MetaIconWrapper = styled.div`
  display: inline-flex;
  margin-left: auto;
  height: 100%;
`;

//#endregion
