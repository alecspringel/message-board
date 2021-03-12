import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import PinImg from "../../imgs/pin.svg";
import BlueCheckmark from "../../imgs/bluecheck.svg";
import GreyCheckmark from "../../imgs/greycheck.svg";

const Checkbox = ({ checkboxName, labelText, onChange, checkStatus }) => {
  return (
    <Wrapper>
      <CheckLabel>
        <Box>
          <CheckMark
            className="checkMark"
            id="Checkmark"
            src={checkStatus == true ? BlueCheckmark : GreyCheckmark}
          />
        </Box>
        <SpecialInput
          name={checkboxName}
          type="checkbox"
          onChange={onChange}
          // onClick was used here for debug purposes
          // onClick={(props) => {
          //   console.log(props.checked || checkStatus);
          // }}
        />

        {labelText}
      </CheckLabel>
    </Wrapper>
  );
};

Checkbox.propTypes = {};

export default Checkbox;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  margin: 0 1em;

  background-color: #f1f1f1;
  /* border: 2px solid red; */
  border-radius: 4px;
`;

const Box = styled.div`
  float: left;
  width: 18px;
  height: 18px;
  margin: 0 0.5em;
`;

const CheckMark = styled.img`
  width: 18px;
  height: 18px;

  transition: 150ms ease-in-out;
`;

const CheckLabel = styled.label`
  margin: 0 0.5em;
  line-height: 1em;
  user-select: none;
  cursor: pointer;
  color: #162b55;
`;

const SpecialInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;

  border: 1px solid black;
`;
