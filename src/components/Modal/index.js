import React from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import Paragraph from "components/Paragraph";
import Heading from "components/Heading";

const Rotate = keyframes`
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(-360deg);
    }
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.34);
  z-index: 5;
`;

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  /* justify-content: center; */
  align-items: center;
  height: 80%;
  width: 80%;
  background-color: ${({ theme }) => theme.dark};
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.12),
    0 4px 4px rgba(0, 0, 0, 0.12), 0 8px 8px rgba(0, 0, 0, 0.12),
    0 16px 16px rgba(0, 0, 0, 0.12);
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.blue};
`;

const Dollar = styled.span`
  font-weight: 700;
  font-size: 8.9rem;
  margin: 5.5rem 0;
  animation: ${Rotate} 3.6s linear infinite;
`;

function Modal() {
  return (
    <Background>
      <Wrapper>
        <Heading>You are out of money!</Heading>
        <Dollar>$0</Dollar>
        <Paragraph>
          You can take a loan in{" "}
          <StyledLink to="/?active=bank">the bank</StyledLink> and come back.
        </Paragraph>
      </Wrapper>
    </Background>
  );
}

export default Modal;
