import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import Options from "./Options";
import Post from "./Post";
import Button from "../common/Button";
import LineWidthImg from "../../imgs/line-width.svg";
import HollowPinImg from "../../imgs/pin-hollow.svg";
import { useParams } from "react-router-dom";
import Fetch from "../common/requests/Fetch";
import { UserContext } from "../context/UserProvider";
import io from "../../services/socketio";

const createPost = (post) => {
  return <Post post={post} key={post._id} isCondensed={false} />;
};

// Sorts the posts by pinned/date
const generateSections = (data) => {
  let posts = { pinned: [], other: [] };
  if (data) {
    data.forEach((post) => {
      if (post.isPinned) {
        posts.pinned.push(createPost(post));
      } else {
        posts.other.push(createPost(post));
      }
    });
  }
  return posts;
};

const PostView = ({ highlightedSection }) => {
  const user = useContext(UserContext);
  const [socketPosts, setSocketPosts] = useState([]);
  useEffect(() => {
    io.emit("join", { room: courseid, room_type: "course" });
    io.on("Post/create", (post) => {
      // Ensure the user isn't the one who posted it
      console.log(post);
      if (
        post &&
        post.postedby._id !== user._id &&
        post.postedby._id !== user.anonymousId
      ) {
        setSocketPosts([post, ...socketPosts]);
      }
    });
    return () => {
      io.emit("leave", { room: courseid });
    };
  }, []);

  const [isCondensed, setCondensedState] = useState(true);
  // Retrieves the courseid from the url parameters
  const { courseid } = useParams();
  let endpoint = "/api/courses/" + courseid + "/posts";

  switch (highlightedSection) {
    case "Instructor":
      endpoint += "?filterby=instructor";
      break;
    case "My Posts":
      endpoint += "?filterby=me";
      break;
    case "My Upvoted":
      endpoint += "?filterby=myupvoted";
      break;
    default:
    // Don't add a filter to endpoint
  }

  // Load posts from course
  let { data, errors, loading } = Fetch({
    type: "get",
    endpoint: endpoint,
  });
  if (data) {
    data = [...socketPosts, ...data];
  }
  let posts = generateSections(data);

  return (
    <>
      <PostFeed>
        <ScrollingDiv>
          <CenterWrapper>
            <SortingOptions>
              <Button
                secondary={true}
                onClick={() => {
                  setCondensedState(!isCondensed);
                }}
              >
                <img src={LineWidthImg} />
              </Button>
              <Button secondary={true} style={MarginLeftRight}>
                {" Most Recent "}
              </Button>
            </SortingOptions>
            {posts.pinned.length > 0 && (
              <PostGroupingHeader>
                <img
                  src={HollowPinImg}
                  style={{ width: 18, height: 18, marginRight: 5 }}
                />
                Pinned Posts
              </PostGroupingHeader>
            )}
            {posts.pinned}
            {posts.other.length > 0 && (
              <PostGroupingHeader>All Posts</PostGroupingHeader>
            )}
            {posts.other}
            <Options courseid={courseid} />
          </CenterWrapper>
        </ScrollingDiv>
      </PostFeed>
      {/* Displays options panel on the right of the webpage */}
    </>
  );
};

PostView.propTypes = {};

export default PostView;

const MarginLeftRight = {
  marginLeft: "1em",
  marginRight: "1em",
};

const PostFeed = styled.div`
  /* overflow: scroll; */
  /* display: flex;
  flex-direction: column;
  align-items: center;
  // border: 1px solid orange;
  flex-grow: 1; */
  /* max-width: 900px; */
  width: 100%;
  position: relative;
  display: flex;
`;

const ScrollingDiv = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  padding: 0 40px;
  overflow: auto;
  //::-webkit-scrollbar {
  //width: 0; /* Remove scrollbar space */
  //background: transparent; /* Optional: just make scrollbar invisible */
  //}
`;

const CenterWrapper = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  padding-right: 280px;
  position: relative;
`;

const SortingOptions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin: 2.2em 0 1em 0;
  position: absolute;
  padding-right: 280px;
`;

const PostGroupingHeader = styled.div`
  margin: 2.2em 0 0em 0;
  font-size: 1.25em;
  font-weight: 500;
`;
//#endregion
