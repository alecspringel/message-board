import React, { useContext, useState } from "react";
import styled from "styled-components";
import LikeImg from "../../imgs/like.svg";
import { UserContext } from "../context/UserProvider";
import LazyFetch from "./requests/LazyFetch";

// Post and User to connect to backend
const Reaction = ({ reactions, type, id, postid }) => {
  const user = useContext(UserContext);
  const [reactionState, setReactions] = useState(reactions);
  const [reactClicked, setClicked] = useState({
    liked: reactions.likes.includes(user._id),
  });

  let endpoint = "/api/reactions";

  switch (type) {
    case "post":
      endpoint += "?postid=" + id;
      break;
    case "comment":
      endpoint += "?commentid=" + id;
      break;
    case "reply":
      endpoint += "?replyid=" + id;
      break;
    default:
    // Don't add a filter to endpoint
  }

  const handleLike = () => {
    LazyFetch({
      type: "put",
      endpoint: endpoint,
      data: null,
      onSuccess: (data) => {
        setReactions(data.reactions);
      },
    });

    var loc = reactionState.likes.indexOf(user._id);

    if (loc === -1) {
      setClicked({ liked: true });
    } else {
      setClicked({ liked: false });
    }
  };

  return (
    <>
      <Icon
        src={LikeImg}
        onClick={handleLike}
        clicked={reactClicked.liked}
        postid={postid}
      />
      <IconValue>{reactionState.likes.length}</IconValue>
    </>
  );
};

export default Reaction;

const Icon = styled.img`
  float: left;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  margin-left: 20px;
  user-select: none;
  cursor: ${(props) => (props.postid ? "pointer" : "default")};
  opacity: ${(props) => (!props.clicked && "50%") || "100%"};
`;

const IconValue = styled.h5`
  color: #8c8c8c;
`;
