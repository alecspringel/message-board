import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserProvider";
import styled from "styled-components";
import TopContent from "./TopContent";
import CourseCard from "./CourseCard";

const generateCourseList = (userCourses) => {
  let ret = [];
  userCourses.forEach((course, index) => {
    ret.push(
      <CourseCard
        key={course.course_id}
        id={course.course_id}
        courseName={course.course_name}
        courseTerm="Winter 2021"
        color={course.color || "#121212"}
      />
    );
  });
  return ret;
};

const Courses = () => {
  const user = useContext(UserContext);
  let currentCourseState = generateCourseList(user.courses);
  const [courseList, setCourseList] = useState(currentCourseState);
  // console.log(currentCourseState);

  return (
    <WrapAll>
      <ScrollDiv>
        <TopContent courseList={courseList} setCourseList={setCourseList} />
        <WrapDisplay className="content">{courseList}</WrapDisplay>
      </ScrollDiv>
    </WrapAll>
  );
};

export default Courses;

const ScrollDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const WrapAll = styled.div`
  width: 100%;
  height: 85vh;
  display: flex;
  flex: 1;
  overflow: auto;
  margin: 0;
`;

const WrapDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 1em 1em 1em 1em;
  padding: 0;
  //transition: 150ms ease-in-out;
`;
