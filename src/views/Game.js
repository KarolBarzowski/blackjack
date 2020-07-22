import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { withRouter, Redirect, Link } from "react-router-dom";
import { gsap } from "gsap";
import { database, auth } from "helpers/firebase";
import { createDeck, shuffleDeck } from "helpers/functions";
import { FadeIn } from "helpers/animations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import backgroundPattern from "assets/images/bg.png";
import { ReactComponent as Text } from "assets/images/text.svg";
import Paragraph from "components/Paragraph";
import Loading from "components/Loading";
import Button from "components/Button";
import Deck from "components/Deck";
import Balance from "components/Balance";
import Modal from "components/Modal";
import ButtonIcon from "components/ButtonIcon";

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

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  z-index: 1;
  margin-top: 1rem;
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

const SliderContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  ::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10rem 20rem;
    z-index: 0;
  }

  :hover {
    ${ButtonIcon}:not(:disabled) {
      opacity: 1;
    }
  }
`;

const Slider = styled.input`
  --webkit-appearance: none;
  appearance: none;
  width: 20rem;
  height: 1rem;
  background-color: rgb(229, 229, 234);
  outline: none;
  border-radius: 1rem;
  margin: 0;

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 2.8rem;
    height: 2.8rem;
    background-color: ${({ theme }) => theme.blue};
    border-radius: 50%;
    border: 3px solid #ffffff;
    cursor: pointer;
  }
`;

const Controls = styled.div`
  position: absolute;
  bottom: 1.5rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

const Value = styled(Paragraph)`
  margin: 1rem 0.5rem 0;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.21);
  border-radius: 0.5rem;
  padding: 0.3rem 0;
  min-width: 7rem;
  z-index: 2;
`;

function Game({ userId }) {
  const leaveRef = useRef(null);
  const betControlsRef = useRef(null);
  const decisionControlsRef = useRef(null);

  const [min, setMin] = useState(1);
  const [max, setMax] = useState(300);
  const [stake, setStake] = useState(min);
  const [lastStake, setLastStake] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prevBalance, setPrevBalance] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isBankrupt, setIsBankrupt] = useState(false);
  const [currentAction, setCurrentAction] = useState("bet");
  const [isAllIn, setIsAllIn] = useState(false);
  const [canDoubleBet, setCanDoubleBet] = useState(false);
  const [canRepeatBet, setCanRepeatBet] = useState(false);

  // read user balance
  useEffect(() => {
    if (userId) {
      const ref = database.ref(`/users/${userId}/balance`);

      ref.once("value").then((snapshot) => {
        setBalance(snapshot.val());
        setIsLoading(false);
      });
    }
  }, [userId]);

  // listen for balance change, update balance in database
  useEffect(() => {
    // check if player bankrupted
    if (balance <= 0) setIsBankrupt(true);
    else setIsBankrupt(false);

    setIsAllIn(balance <= max);
    setCanDoubleBet(balance - lastStake * 2 >= 0);
    setCanRepeatBet(balance - lastStake >= 0);

    // update balance in database
    if (userId) {
      const ref = database.ref(`/users/${userId}`);
      ref.update({ balance });
    }

    setTimeout(() => {
      setPrevBalance(balance);
    }, 1750);

    // eslint-disable-next-line
  }, [balance]);

  // listen for action change
  useEffect(() => {
    if (!isLoading) {
      gsap.defaults({ ease: "power2.inOut", duration: 0.75 });

      switch (currentAction) {
        case "bet":
          const tl = gsap.timeline();

          tl.to(decisionControlsRef.current, {
            y: 200,
            autoAlpha: 0,
          }).fromTo(
            betControlsRef.current,
            {
              y: 200,
              autoAlpha: 0,
            },
            {
              y: 0,
              autoAlpha: 1,
            },
            0.25
          );

          break;

        default:
          break;
      }
    }
  }, [currentAction, isLoading]);

  const handleBet = () => {};

  return isLoading ? (
    <Loading />
  ) : (
    <Wrapper>
      {isBankrupt && <Modal />}
      <LeaveButton to="/" ref={leaveRef}>
        <Icon icon={faArrowLeft} />
        <StyledParagraph>Leave table</StyledParagraph>
      </LeaveButton>
      <Balance start={prevBalance} end={balance} />
      <TableText>
        <Text />
      </TableText>
      <Deck />
      <Controls ref={betControlsRef}>
        <Button
          type="button"
          onClick={() => handleBet(min)}
          // disabled={isAnimating}
        >
          Min. ${min}
        </Button>

        <Button
          type="button"
          onClick={() => handleBet(isAllIn ? balance : max)}
          // disabled={isAnimating}
        >
          {isAllIn ? `All in` : `Max. $${max}`}
        </Button>

        <SliderContainer>
          <Row>
            <Button
              type="button"
              margin
              onClick={() => handleBet()}
              // disabled={isAnimating}
            >
              CONFIRM
            </Button>
          </Row>
          <Row>
            <StyledParagraph>${min}</StyledParagraph>
            <Slider
              type="range"
              min={min}
              max={isAllIn ? balance : max}
              value={stake}
              onChange={(e) => setStake(e.target.value)}
            />
            <StyledParagraph>${isAllIn ? balance : max}</StyledParagraph>
          </Row>
          <Row>
            <ButtonIcon
              type="button"
              disabled={parseFloat(stake) <= min}
              onClick={() => {
                setStake(parseFloat(stake) - 1);
              }}
            >
              <Icon icon={faMinus} />
            </ButtonIcon>
            <Value>${stake}</Value>
            <ButtonIcon
              type="button"
              disabled={parseFloat(stake) >= (isAllIn ? balance : max)}
              onClick={() => {
                setStake(parseFloat(stake) + 1);
              }}
            >
              <Icon icon={faPlus} />
            </ButtonIcon>
          </Row>
        </SliderContainer>

        <Button
          type="button"
          // disabled={!lastStake || isAnimating || !canDoubleBet}
          onClick={() => handleBet(lastStake * 2)}
        >
          DOUBLE {lastStake && `$${lastStake * 2}`}
        </Button>

        <Button
          type="button"
          // disabled={!lastStake || isAnimating || !canRepeatBet}
          onClick={() => handleBet(lastStake)}
        >
          REPEAT {lastStake && `$${lastStake}`}
        </Button>
      </Controls>
      <Controls ref={decisionControlsRef}>
        <Button
          type="button"
          // onClick={() => handleBet(min)}
          // disabled={isAnimating}
        >
          HIT
        </Button>

        <Button
          type="button"
          // onClick={() => handleBet(isAllIn ? balance : max)}
          // disabled={isAnimating}
        >
          STAND
        </Button>

        <Button
          type="button"
          // onClick={() => handleBet(isAllIn ? balance : max)}
          // disabled={isAnimating}
        >
          DOUBLE
        </Button>
      </Controls>
    </Wrapper>
  );
}

export default Game;
