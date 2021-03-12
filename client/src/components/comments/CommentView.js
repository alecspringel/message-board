import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import Post from "../posts/Post";
import Sidebar from "../posts/Sidebar";
import Button from "../common/Button";
import Comment from "./Comment";
import LazyFetch from "../common/requests/LazyFetch";
import { UserContext } from "../context/UserProvider";
import io from "../../services/socketio";

const renderComments = (data) => {
  let ret = [];
  if (data) {
    data.forEach((comment) => {
      ret.push(<Comment comment={comment} key={comment._id} />);
    });
  }
  return ret;
};

const CommentView = ({ classroomName }) => {
  const user = useContext(UserContext);
  const history = useHistory();
  // Stores comments fetched live from socketio
  const [newComments, setNewComments] = useState({ draft: false });
  const [commentData, setCommentData] = useState([]);
  const { courseid, postid } = useParams();
  const [highlightedSection, setHighlightedSection] = useState("");

  const redirect = (sectionFilter) => {
    history.push({
      pathname: "/course/" + courseid,
      state: { filter: sectionFilter },
    });
  };

  // location is passed from the react-router Link which stores
  // the post that was clicked under location.state
  let location = useLocation();
  let post;
  if (location.state) {
    post = location.state.post;
  }

  // Fetch comments
  useEffect(() => {
    if (post) {
      LazyFetch({
        type: "get",
        endpoint: "/api/posts/" + post._id + "/comments",
        onSuccess: (data) => {
          setCommentData([...renderComments(data)]);
        },
      });
    }
    io.emit("join", { room: postid, room_type: "post" });
    return () => {
      io.emit("leave", { room: postid });
    };
  }, [post]);

  useEffect(() => {
    io.on("Comment/create", (comment) => {
      console.log(comment);
      // Ensure the user isn't the one who posted it
      if (
        comment &&
        comment.postedby._id !== user._id &&
        comment.postedby._id !== user.anonymousId
      ) {
        console.log(commentData);
        setCommentData([
          ...commentData,
          <Comment comment={comment} key={comment._id} />,
        ]);
      }
    });
    io.on("Reply/create", (comment) => {
      console.log(commentData);
      console.log(comment, "ws");
      // Take copy of socketComments and append reply to matching comment (with _id)
      console.log(commentData);
      let allComments = [...commentData];
      console.log(allComments);
      for (let i in allComments) {
        console.log(allComments[i], "in for loop");
        if (allComments[i].props.comment._id === comment._id) {
          console.log("found a match");
          allComments[i] = <Comment comment={comment} key={comment._id} />;
          break;
        }
      }
      setCommentData(allComments);
    });
  }, [commentData]);

  const draftNewComment = () => {
    setNewComments({
      draft: true,
    });
  };
  // Takes a boolean value: true creates, false cancels
  const finishComment = (content) => {
    // If false, clear the draft
    if (!content) {
      setNewComments({ draft: false });
    } else {
      LazyFetch({
        type: "post",
        endpoint: "/api/posts/" + post._id + "/comments",
        data: { isAnonymous: false, content: content },
        onSuccess: (data) => {
          setNewComments({ draft: false });
          setCommentData([
            ...commentData,
            <Comment comment={data} key={data._id} />,
          ]);
        },
      });
    }
  };
  console.log(commentData);

  let comments = [...commentData];
  if (newComments.draft) {
    const draft = {
      postedby: {
        first: user.first,
        last: user.last,
        _id: user._id,
      },
      replies: [],
    };
    comments.push(
      <Comment
        comment={draft}
        isDraft={true}
        callback={finishComment}
        key="draft"
      />
    );
  }
  return (
    <CommentViewWrapper>
      <Sidebar
        classroomName={classroomName}
        setHighlightedSection={redirect}
        highlightedSection={highlightedSection}
      />

      <CommentViewContainer>
        <AbsoluteWrapper>
          <ScrollingDiv>
            <MaxWidth>
              <OptionsContainer>
                <Link
                  to={"/course/" + courseid}
                  style={{ textDecoration: "none" }}
                >
                  <Button secondary>Back to all Posts</Button>
                </Link>
                {postid !== "new" && (
                  <Button onClick={draftNewComment} secondary>
                    Reply to Post
                  </Button>
                )}
              </OptionsContainer>
              <Post
                post={post}
                isCondensed={false}
                isDraft={postid === "new"}
              />
              {comments}
            </MaxWidth>
          </ScrollingDiv>
        </AbsoluteWrapper>
      </CommentViewContainer>
    </CommentViewWrapper>
  );
};

CommentView.propTypes = {};

export default CommentView;

const CommentViewWrapper = styled.div`
  display: flex;
  height: 100%;
`;

const CommentViewContainer = styled.div`
  position: relative;
  width: 100%;
  /* border: 1px solid green; */
`;

const AbsoluteWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 2.2em 0 1.1em 0;
`;

const ScrollingDiv = styled.div`
  height: 100%;
  width: 100%;
  padding: 0 280px 0 40px;
  overflow: auto;
  padding-right: 280px;
`;

const MaxWidth = styled.div`
  max-width: 900px;
  margin: auto;
  padding-bottom: 40px;
`;
