import React, { useState, useEffect, forwardRef } from "react";
import styled, { keyframes } from "styled-components";
import CountUp from "react-countup";
import { SlideInLeft } from "helpers/animations";
import Paragraph from "components/Paragraph";

const Disappear = keyframes`
  from {
    opacity: 1;
    transform: translate(-10rem, -50%);
  }

  to {
    opacity: 0;
    transform: translate(0, -50%);
  }
`;

const BorderDelay = keyframes`
  from {
    border-radius: 0 0.5rem 0.5rem 0;
  }

  to {
    border-radius: 0.5rem;
  }
`;

const Tooltip = styled.span`
  position: absolute;
  left: 0;
  top: 50%;
  padding: 0.4rem 0 0.4rem 0.8rem;
  width: 10rem;
  height: 100%;
  margin: 0;
  border-radius: 0.5rem 0 0 0.5rem;
  background-color: rgba(0, 0, 0, 0.21);
  transform: translate(0, -50%);
  opacity: 0;
  transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
  animation: ${Disappear} 0.15s ease-in-out 5s backwards;
`;

const Wrapper = styled(Paragraph)`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.21);
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  z-index: 1;
  animation: ${SlideInLeft} 0.75s ease-in-out forwards,
    ${BorderDelay} 0.15s ease-in-out 5s backwards;

  ::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 5rem 15rem;
    z-index: 0;
  }

  :hover {
    border-radius: 0 0.5rem 0.5rem 0;
    ${Tooltip} {
      opacity: 1;
      transform: translate(-10rem, -50%);
    }
  }
`;

const Balance = forwardRef(({ start, end }, ref) => {
  const [isTooltipHidden, setIsTooltipHidden] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsTooltipHidden(true);
    }, 5000);
  }, []);

  return (
    <Wrapper ref={ref}>
      <Tooltip hide={isTooltipHidden}>Balance:</Tooltip>
      $
      <CountUp start={start || 0} end={end || 0} duration={1.75} delay={0} />
    </Wrapper>
  );
});

export default Balance;
