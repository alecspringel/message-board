import React, { useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import JoinConfirmation from "./joinCourse/JoinConfirmation";
import JoinInfo from "./joinCourse/JoinInfo";

const JoinCourse = ({ courseList, setCourseList }) => {
  const [modalIsShown, toggleModal] = useState(false);
  const [course, joinCourse] = useState(null);
  const [display, toggleDisplay] = useState("flex");

  return (
    <>
      <Button secondary onClick={() => toggleModal(true)}>
        Join a Course
      </Button>
      {modalIsShown && (
        <Modal
          close={() => {
            toggleModal(false);
            toggleDisplay("flex");
          }}
          width="724px"
          data-testid="join-course-modal"
        >
          {!course ? (
            <JoinInfo joinCourse={joinCourse} />
          ) : (
            <JoinConfirmation
              course={course}
              joinCourse={joinCourse}
              display={display}
              toggleDisplay={toggleDisplay}
              courseList={courseList}
              setCourseList={setCourseList}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default JoinCourse;
