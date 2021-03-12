import React, { useState } from "react";
import styled from "styled-components";
import ShareImg from "../../../imgs/share-white.svg";
import Button from "../../common/Button";
import Input from "../../common/Input";
import InputLabel from "../../common/InputLabel";
import CopyImg from "../../../imgs/copy.svg";

const CourseConfirmation = ({ course, close }) => {
  const [showMessage, triggerMessage] = useState(false);
  return (
    <div className="flex-col align justify">
      <Circle>
        <ShareIcon src={ShareImg} />
      </Circle>
      <h4 className="margin-t20">ACCESS CODE</h4>
      <p className="p-small margin-t5">
        Anyone with the access code can join.
        <br />
        Share the code below with students.
      </p>
      <HighlightedSection className="flex-row">
        {/* <LeftColumn className="flex-col flex-1">
          <InputLabel margin="0 0 7px">Invite Link</InputLabel>
          <CopyOverlay>
            <CopyIcon src={CopyImg} />
            <Input
              value={
                process.env.REACT_APP_CLIENT_URL + "/join/" + course.course_id
              }
              readOnly
            />
          </CopyOverlay>
        </LeftColumn> */}
        <RightColumn className="flex-col flex-1">
          <InputLabel margin="0 0 7px">Access Code</InputLabel>
          <CopyOverlay
            onClick={() => {
              navigator.clipboard.writeText(course.course_id);
              triggerMessage(true);
              setTimeout(() => {
                triggerMessage(false);
              }, 600);
            }}
          >
            <CopyIcon src={CopyImg} />
            <Input
              value={course.course_id}
              readOnly
              style={{ cursor: "pointer" }}
            />
            {showMessage && (
              <CopyMessage className="copymessage">Copied!</CopyMessage>
            )}
          </CopyOverlay>
        </RightColumn>
      </HighlightedSection>
      <Button primary autoWidth style={{ marginTop: 24 }} onClick={close}>
        Okay!
      </Button>
    </div>
  );
};

export default CourseConfirmation;

const LeftColumn = styled.div`
  margin-right: 5px;
`;

const RightColumn = styled.div`
  margin-left: 5px;
`;

const Circle = styled.div`
  background: #4a86fa;
  box-shadow: 0px 0px 7px 2px rgb(74 134 250 / 19%);
  height: 55px;
  width: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
`;

const ShareIcon = styled.img`
  height: 34px;
`;

const HighlightedSection = styled.div`
  background-color: #f8f8f8;
  margin-top: 20px;
  padding: 15px;
  border-radius: 4px;
  width: 100%;
`;

const CopyOverlay = styled.div`
  position: relative;
  cursor: pointer;
  :hover {
    img {
      transition: transform 150ms ease-in-out;
      transform: scale(1.1);
    }
  }
`;

const CopyIcon = styled.img`
  height: 24px;
  position: absolute;
  right: 5px;
  background: white;
  top: 4px;
`;

const CopyMessage = styled.div`
  position: absolute;
  bottom: 120%;
  bottom: 5.5px;

  right: -15px;
  right: 35px;
  background: #e8e8e8;
  border-radius: 4px;
  padding: 2px 5px;
`;
