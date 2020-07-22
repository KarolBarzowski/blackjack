import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { withRouter, Redirect, Link } from "react-router-dom";
import { gsap } from "gsap";
import { database, auth } from "helpers/firebase";
import { createDeck, shuffleDeck } from "helpers/functions";
import { FadeIn } from "helpers/animations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import backgroundPattern from "assets/images/bg.png";
import { ReactComponent as Text } from "assets/images/text.svg";
import Paragraph from "components/Paragraph";
import Loading from "components/Loading";
import Button from "components/Button";
import Deck from "components/Deck";
import Balance from "components/Balance";

const Wrapper = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  padding: 3.4rem 1.5rem 5.5rem 1.5rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  background-color: ${({ theme }) => theme.table};
  background-image: url(${backgroundPattern});
  background-repeat: repeat;
  box-shadow: inset 1px 1px 120px 30px rgba(3, 3, 3, 0.5);
  animation: ${FadeIn} 0.5s ease-in-out forwards;
`;

const TableText = styled.div`
  position: absolute;
  top: 22%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  user-select: none;
`;

const StyledParagraph = styled(Paragraph)`
  margin: 0 1rem;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 1.6rem;
  color: #000000;
`;

const LeaveButton = styled(Link)`
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  display: flex;
  align-items: center;
  background-color: transparent;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: color 0.05s ease-in-out;
  outline: none;

  ${StyledParagraph} {
    color: ${({ theme }) => theme.textSecondary};
  }

  ${Icon} {
    font-size: 2.4rem;
    color: ${({ theme }) => theme.textSecondary};
    transition: color 0.05s ease-in-out;
  }

  :hover,
  :focus {
    ${StyledParagraph} {
      color: ${({ theme }) => theme.text};
    }

    ${Icon} {
      color: ${({ theme }) => theme.text};
    }
  }
`;

const InfoWrapper = styled.div`
  position: absolute;
  bottom: 23.3rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.21);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const InfoParagraph = styled(Paragraph)`
  margin-bottom: 1.5rem;
`;

const Blue = styled.span`
  color: ${({ theme }) => theme.blue};
`;

const Controls = styled.div`
  position: absolute;
  bottom: 9.8rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

function Game({ userId }) {
  const leaveRef = useRef(null);
  const controlsRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [prevBalance, setPrevBalance] = useState(0);
  const [balance, setBalance] = useState(0);

  // listen for balance change in database
  useEffect(() => {
    const ref = database.ref(`/users/${userId}/balance`);

    const handleChange = (snapshot) => {
      setBalance(snapshot.val());
    };

    if (userId) {
      ref.on("value", handleChange);
      setIsLoading(false);
    }

    return () => {
      ref.off("value", handleChange);
    };
  }, [userId]);

  // listen for state balance change
  useEffect(() => {
    setTimeout(() => {
      setPrevBalance(balance);
    }, 1000);
  }, [balance]);

  return isLoading ? (
    <Loading />
  ) : (
    <Wrapper>
      <LeaveButton to="/" ref={leaveRef}>
        <Icon icon={faArrowLeft} />
        <StyledParagraph>Leave table</StyledParagraph>
      </LeaveButton>
      <Balance start={prevBalance} end={balance} />
      <TableText>
        <Text />
      </TableText>
      <Deck />
      {/* {isStarted && (
        <Controls ref={controlsRef}>
          <Button>HIT</Button>
        </Controls>
      )} */}
    </Wrapper>
  );
}

export default Game;
