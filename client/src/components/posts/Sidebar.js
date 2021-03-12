import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import SectionTab from "./SectionTab";
import UserImg from "../../imgs/user.svg";
import { UserContext } from "../context/UserProvider";
import BookmarkImg from "../../imgs/bookmark.svg";
import GlassesImg from "../../imgs/glasses.svg";
import NoteImg from "../../imgs/note.svg";
import HeartImg from "../../imgs/heart.svg";

/* Sidebar view shows tabs of different post feeds and shows which one is selected */
const Sidebar = ({ setHighlightedSection, highlightedSection }) => {
  const { courseid, postid } = useParams();

  // Extracting the course name from the user context and current course ID
  var classroomID = useParams().courseid;
  var courseContext = useContext(UserContext).courses;
  var classroomName = " ";

  console.log(courseContext, "COURSE CONTEXT");

  for (let temp in courseContext) {
    if (courseContext[temp].course_id === classroomID) {
      classroomName = courseContext[temp].course_name;
      break;
    }
  }

  // If the name is longer than 18 characters, scale the font size down by this proportion
  var nameRatio = Math.min(1.0, 12 / classroomName.length);
  //var nameRatio = 1;

  return (
    <FlexWrapper>
      <Container>
        <Link to={"/course/" + courseid} style={{ textDecoration: "none" }}>
          <ClassTitle nameFit={nameRatio}>{classroomName}</ClassTitle>
        </Link>

        <HR />
        <Section>
          <SectionTab
            tabText={"All Posts"}
            imageLocation={NoteImg}
            setHighlightedSection={setHighlightedSection}
            highlightedSection={highlightedSection}
          />
          <SectionTab
            tabText={"Instructor"}
            imageLocation={GlassesImg}
            setHighlightedSection={setHighlightedSection}
            highlightedSection={highlightedSection}
          />
        </Section>

        <ClassSubtitle>My Posts</ClassSubtitle>

        <Section>
          <SectionTab
            tabText={"My Posts"}
            imageLocation={UserImg}
            setHighlightedSection={setHighlightedSection}
            highlightedSection={highlightedSection}
          />
          <SectionTab
            tabText={"My Upvoted"}
            imageLocation={HeartImg}
            setHighlightedSection={setHighlightedSection}
            highlightedSection={highlightedSection}
          />
          {/* <SectionTab
            tabText={"Bookmarked"}
            imageLocation={BookmarkImg}
            setHighlightedSection={setHighlightedSection}
            highlightedSection={highlightedSection}
          /> */}
        </Section>
      </Container>
    </FlexWrapper>
  );
};

export default Sidebar;

// #region Sidebar Stylings
const HR = styled.hr`
  width: 80%;
  border: 1px solid #dddddd;
`;

const FlexWrapper = styled.div`
  flex: 0 0 200px;
`;

const Container = styled.div`
  height: calc(100vh - 55px);
  box-shadow: 5px 2px 6px -2px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  max-width: 200px;
`;

const ClassTitle = styled.h1`
  height: 2em;
  line-height: 2.5em;
  font-size: ${(props) => props.nameFit * 1.5}rem;
  text-align: center;
  user-select: none;
`;

const ClassSubtitle = styled.h2`
  height: 2em;
  margin-left: 1.5em;
  line-height: 2.5em;
  font-size: 1.25rem;
  text-align: left;
  color: #b8b8b8;
  user-select: none;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
