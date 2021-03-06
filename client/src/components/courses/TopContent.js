import React from "react";
import styled from "styled-components";
import JoinCourse from "./JoinCourse";
import CreateCourse from "./CreateCourse";

const TopContent = ({ courseList, setCourseList }) => {
  return (
    <TopWrapper className="flex-row align">
      <Title>COURSES</Title>
      <JoinCourse courseList={courseList} setCourseList={setCourseList} />
      <CreateCourse courseList={courseList} setCourseList={setCourseList} />
    </TopWrapper>
  );
};

export default TopContent;

const Title = styled.h3`
  margin-right: 15px;
`;

const TopWrapper = styled.div`
  margin: 1em 1em 1em 1em;
`;
