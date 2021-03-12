import React from "react";
import styled from "styled-components";
import CommentImg from "../../imgs/comment.svg";
import Reaction from "../common/Reaction";

const PostReactions = ({ post, postid }) => {
  return (
    <>
      <Reaction
        reactions={post.reactions}
        type="post"
        id={post._id}
        postid={postid}
      />
      <Icon src={CommentImg} />
      <IconValue>{post.comments}</IconValue>
    </>
  );
};

export default PostReactions;

const Icon = styled.img`
  float: left;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  margin-left: 20px;
  user-select: none;
`;

const IconValue = styled.h5`
  color: #8c8c8c;
`;
