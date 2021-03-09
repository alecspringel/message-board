import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import Logo from "../../imgs/inquire-logo.png";
import Dropdown from "../common/dropdown/Dropdown";
import SearchBar from "../common/SearchBar";
import ProfileDropdown from "./ProfileDropdown";
import Fetch from "../common/requests/Fetch";

const TopNavBar = () => {
  const { courseid } = useParams();
  let endpoint = "/api/courses/" + courseid + "/posts?search=";

  const handleOnChange = (e) => {
    endpoint += e.target.value;
    console.log(endpoint);
    const { data, errors, loading } = Fetch({
      type: "get",
      endpoint: endpoint,
    });
    console.log(data);
  };

  return (
    <Nav>
      <Wrapper>
        <Link to={"/"}>
          <LogoImg src={Logo} />
        </Link>
      </Wrapper>
      <Wrapper>
        {courseid ? (
          <SearchBar
            placeholder="Search for a post"
            onChange={handleOnChange}
          />
        ) : (
          <Dropdown content={"temp"}></Dropdown>
        )}
      </Wrapper>
      <Wrapper>
        <ProfileDropdown />
      </Wrapper>
    </Nav>
  );
};

export default TopNavBar;

const Wrapper = styled.div`
  flex: 1;
`;

const Nav = styled.nav`
  width: 100vw;
  height: 66px;
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 9999;
`;

const LogoImg = styled.img`
  height: 40px;
`;
