import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loading = () => (
  <Wrapper>
    <FontAwesomeIcon icon={faSpinner} size="4x" spin />
  </Wrapper>
);

export default Loading;
