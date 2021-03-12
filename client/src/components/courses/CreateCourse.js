import React, { useState } from "react";
import styled from "styled-components";
import Button from "../common/Button";
import Modal from "../common/Modal";
import CourseConfirmation from "./createCourse/CourseConfirmation";
import CourseInfo from "./createCourse/CourseInfo";
import CourseCard from "./CourseCard";

const AddNewCourseToList = (newCourse, courseList) => {
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

const CreateCourse = ({ courseList, setCourseList }) => {
  const [modalIsShown, toggleModal] = useState(false);
  // Course is set by the CourseInfo component when instructors create the course
  // The info is used to share the course link/access code provided by the API
  const [course, setCourse] = useState(null);

  return (
    <>
      <Button
        secondary
        style={{ marginLeft: 10 }}
        onClick={() => {
          toggleModal(true);
        }}
      >
        Create a Course
      </Button>
      {modalIsShown && (
        <Modal
          close={() => {
            toggleModal(false);
          }}
          width="620px"
          data-testid="join-course-modal"
        >
          {!course ? (
            <CourseInfo setCourse={setCourse} />
          ) : (
            <CourseConfirmation
              course={course}
              close={() => {
                let newCourseList = AddNewCourseToList(course, courseList);
                setCourseList(newCourseList);
                toggleModal(false);
                setCourse(null);
              }}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default CreateCourse;

const AnimationSlider = styled.div``;
