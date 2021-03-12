import React, { useState, useContext } from "react";
import styled from "styled-components";
import Button from "../../common/Button";
import axios from "axios";
import CheckMarkBlue from "../../../imgs/checkmark_blue.svg";
import CheckMarkGreen from "../../../imgs/checkmark_green.svg";
import Errors from "../../common/Errors";
import CourseCard from "../CourseCard";
import { UserContext, UserDispatchContext } from "../../context/UserProvider";

const AddNewCourseToList = (newCourse, courseList) => {
  if (newCourse === null) return;
  // console.log("Course to add: ", newCourse);
  // console.log("Example from list: ", courseList[0]);
  // console.log("Before: ", "\nCourseList: ", courseList);

  let ret = [];
  for (let i = 0; i < courseList.length; i++) {
    // console.log(courseList[i]);
    ret.push(
      <CourseCard
        key={courseList[i].props.id}
        id={courseList[i].props.id}
        courseName={courseList[i].props.courseName}
        courseTerm="Winter 2021"
        color={courseList[i].props.color || "#121212"}
      />
    );
  }

  ret.push(
    <CourseCard
      key={newCourse.course_id}
      id={newCourse.course_id}
      courseName={newCourse.course_name}
      courseTerm="Winter 2021"
      color={newCourse.color || "#121212"}
    />
  );

  // console.log("After: ", "\nCourseList: ", ret);
  return ret;
};

const JoinConfirmation = ({
  course,
  joinCourse,
  display,
  toggleDisplay,
  courseList,
  setCourseList,
}) => {
  const [loading, toggleLoading] = useState(false);
  const [errors, toggleErrors] = useState(null);
  const [success, toggleSuccess] = useState(null);
  const user = useContext(UserContext);
  const setUser = useContext(UserDispatchContext);

  console.log(display);
  console.log("SUCCESS Message: " + success);

  const confirmJoinRequest = () => {
    toggleLoading(true);
    setTimeout(() => {
      const endpoint = "/api/join";
      const data = {
        course_id: course.course_id,
      };
      axios
        .put(process.env.REACT_APP_SERVER_URL + endpoint, data, {
          withCredentials: true,
        })
        .then((res) => {
          let newCourseList = AddNewCourseToList(res.data.course, courseList);
          if (newCourseList != null) setCourseList(newCourseList);
          joinCourse(res.data.course);

          // have to update the user model in order to correct get the course page
          let temp = user;
          temp.courses.push(res.data.course);
          setUser(temp);

          toggleSuccess(res.data.success);
          toggleLoading(false);
          toggleDisplay("none");
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            // Set the errors provided by our API request
            console.log(err.response.data.errors);
            toggleLoading(false);
            toggleErrors(err.response.data.errors);
          } else {
            toggleLoading(false);
            toggleErrors([
              "There was an error joining the course. Please try again.",
            ]);
          }
        });
    }, 1000);
  };

  return (
    <Wrapper className="flex-col align justify">
      <img src={display == "none" ? CheckMarkGreen : CheckMarkBlue}></img>
      <Title className="margin-t20" style={{ display: display }}>
        CONFIRM COURSE
      </Title>
      <Success
        style={display == "none" ? { display: "block" } : { display: display }}
      >
        {success}
      </Success>
      <HighlightedSection className="flex-row" style={{ display: display }}>
        <CourseInfo>
          <Course>
            <div style={{ opacity: "70%" }}>Course:&nbsp;</div>{" "}
            <TextContent>{course.course}</TextContent>
          </Course>
          <Instructor>
            <div style={{ opacity: "70%" }}>Instructor:&nbsp;</div>
            <TextContent>
              {course.first} {course.last}
            </TextContent>
          </Instructor>
        </CourseInfo>
      </HighlightedSection>
      <BottomButtons style={{ display: display }}>
        <Button
          secondary
          autoWidth
          style={{ margin: "24px 1em 0 1em" }}
          onClick={() => {
            joinCourse(null);
          }}
        >
          Back
        </Button>
        <Button
          primary
          autoWidth
          onClick={() => {
            confirmJoinRequest();
          }}
          loading={loading}
          style={{ margin: "24px 1em 0 1em" }}
        >
          Confirm
        </Button>
      </BottomButtons>
      <Errors errors={errors} />
    </Wrapper>
  );
};

export default JoinConfirmation;

const Wrapper = styled.div``;

const Title = styled.h4`
  font-size: 30px;
`;

const BottomButtons = styled.div`
  display: flex;
  width: 100%;
`;

const CourseInfo = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;

  height: 4em;
`;

const Course = styled.div`
  display: flex;
  flex-direction: row;

  margin: 0.5em 0;
`;

const Instructor = styled.div`
  display: flex;
  flex-direction: row;

  margin: 0.5em 0;
`;

const HighlightedSection = styled.div`
  background-color: #f8f8f8;
  margin-top: 20px;
  padding: 15px;
  border-radius: 4px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const TextContent = styled.div`
  font-weight: 400;
  font-style: normal;
`;

const Success = styled.div`
  display: none;

  font-size: 30px;
`;
