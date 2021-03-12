import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Input from "../common/Input";
import DraftTextArea from "../common/DraftTextArea";
import Button from "../common/Button";

const Messages = (props) => {
  return (
    <Wrapper>
      <PageTitle>Messages Page</PageTitle>
      <PageSubtitle>Proof of concept. Does not function yet.</PageSubtitle>
      <MockupContainer>
        <ContentContainer>
          <ContentTitle>Format Your Message Below</ContentTitle>
          <Input
            style={{
              boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.07)",
              margin: "0 0 1em 0",
            }}
            placeholder={"Message Title"}
          />
          <DraftTextArea
            style={{
              boxShadow: "0px 1px 4px 2px rgba(0, 0, 0, 0.07)",
              border: "1px solid rgba(18, 18, 18, 0.5)",
              margin: "0 0 1em 0",
            }}
            placeholder={"Type your message here..."}
            minRows={12}
          />
          <ButtonContainer>
            <Button primary>Submit</Button>
          </ButtonContainer>
        </ContentContainer>
      </MockupContainer>
    </Wrapper>
  );
};

Messages.propTypes = {};

export default Messages;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PageTitle = styled.h1`
  /* margin: 1em 0; */
  padding: 0.5em 0;
  text-align: center;
  font-size: 48px;
`;

const PageSubtitle = styled.h2`
  padding: 0 0 1em 0;

  text-align: center;
  font-size: 28px;
`;

const MockupContainer = styled.div`
  width: 900px;
  height: 450px;
  padding: 1.5em;
  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;

  height: 100%;
  /* border: 1px solid black; */
`;

const ContentTitle = styled.h3`
  margin: 0 0 1em 0;

  text-align: center;
  font-size: 24px;

  /* border: 1px solid black; */
`;

const ButtonContainer = styled.div`
  /* border: 1px solid black; */
`;
