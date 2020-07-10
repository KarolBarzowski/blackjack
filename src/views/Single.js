import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import backgroundPattern from "assets/images/bg.png";
import Heading from "components/Heading/Heading";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import ReactArcText from "react-arc-text-fix";
import { gsap } from "gsap";

const SlideIn = keyframes`
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
`;

const Disappear = keyframes`
  from {
    transform: translateY(3.5rem);
  }

  to {
    transform: translateY(0);
  }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 7.9rem 1.5rem 5.5rem;
  display: flex;
  flex-flow: column-reverse nowrap; /* REMOVE -reverse */
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  background-color: ${({ theme }) => theme.table};
  background-image: url(${backgroundPattern});
  background-repeat: repeat;
  box-shadow: inset 1px 1px 120px 30px rgba(3, 3, 3, 0.5);
  /* animation: ${SlideIn} 0.5s ease-in-out forwards; */
`;

const ButtonIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background-color: white;
  height: 2.4rem;
  width: 2.4rem;
  margin: 1rem 0 0;
  outline: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s ease-in-out;

  :disabled {
    opacity: 0;
    cursor: default;
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

const Paragraph = styled.p`
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 2.1rem;
  margin: 0 1rem;
`;

const Value = styled(Paragraph)`
  margin: 1rem 0.5rem 0;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.21);
  border-radius: 0.5rem;
  padding: 0.3rem 0;
  width: 7rem;
`;

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  z-index: 1;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 1.6rem;
  color: #000000;
`;

const TableText = styled.div`
  position: absolute;
  top: 20%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  user-select: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

const Button = styled.button`
  border: none;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.blue};
  color: ${({ theme }) => theme.text};
  font-family: "Montserrat", sans-serif;
  font-size: 2.1rem;
  font-weight: 500;
  padding: 0.8rem;
  height: 4.2rem;
  margin: 0 0.5rem ${({ margin }) => (margin ? "1rem" : "-1rem")};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  cursor: pointer;
  transition: background-color 0.05s ease-in-out;
  z-index: 1;
  outline: none;

  :hover:not(:disabled) {
    background-color: #0073ee;
  }

  :disabled {
    cursor: default;
    opacity: 0.38 !important;
  }
`;

const LeaveButton = styled(Link)`
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  display: flex;
  align-items: center;
  background-color: transparent;
  color: ${({ theme }) => theme.textSecondary};
  text-decoration: none;
  transition: color 0.05s ease-in-out;

  ${Icon} {
    font-size: 2.4rem;
    color: ${({ theme }) => theme.textSecondary};
    transition: color 0.05s ease-in-out;
  }

  :hover {
    color: ${({ theme }) => theme.text};

    ${Icon} {
      color: ${({ theme }) => theme.text};
    }
  }
`;

const ChatMsg = styled.p`
  font-size: 1.6rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  margin: 0.25rem 0 0;
  padding: 0.8rem;
  border-radius: 0.5rem;
  background-color: rgba(0, 0, 0, 0.34);
  transition: opacity 0.1s ease-in-out;
  animation: ${SlideIn} 0.5s ease-in-out backwards 0.05s;

  ${({ hide }) =>
    hide &&
    css`
      display: none;
    `}

  ${({ disappear }) =>
    disappear &&
    css`
      animation: ${Disappear} 0.5s ease-in-out forwards;
      transition: opacity 0.5s ease-in-out;
      opacity: 0;
    `}
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  transition: opacity 0.1s ease-in-out;

  :hover {
    opacity: 1;

    ${ChatMsg} {
      transition: opacity 0.1s ease-in-out;
      opacity: 1;
    }
  }

  ${({ hide }) =>
    hide &&
    css`
      opacity: 0.38;
    `}
`;

const BlueParagraph = styled.span`
  color: ${({ theme }) => theme.blue};
  padding: 0;
  margin: 0;
  font-weight: 500;
`;

function Single() {
  const valueRef = useRef(null);
  const minRef = useRef(null);
  const maxRef = useRef(null);
  const confirmRef = useRef(null);
  const doubleRef = useRef(null);
  const repeatRef = useRef(null);
  const sliderRef = useRef(null);
  const leaveRef = useRef(null);
  const chatRef = useRef(null);

  const [min, setMin] = useState(1);
  const [max, setMax] = useState(300);
  const [sliderValue, setSliderValue] = useState(min);
  const [lastStake, setLastStake] = useState(null);
  const [currentAction, setCurrentAction] = useState("bet");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();

    setLogs((prevLogs) => [
      ...prevLogs,
      {
        time: `${hour}:${minute}`,
        msg: "You has joined to the game",
      },
    ]);
  }, []);

  useEffect(() => {
    console.log("currentAction:", currentAction); // REMOVE

    switch (currentAction) {
      case "bet":
        gsap.defaults({ duration: 0.75, ease: "power2.inOut" });

        const slideInUp = (element) => {
          const tl = gsap.timeline();

          tl.fromTo(
            element,
            {
              opacity: 0,
              y: 200,
            },
            { y: 0, opacity: 1 }
          );

          return tl;
        };

        const slideInRight = (element) => {
          const tl = gsap.timeline();

          tl.fromTo(
            element,
            {
              x: "-=200px",
            },
            {
              x: 0,
            }
          );

          return tl;
        };

        const master = gsap
          .timeline()
          .add(slideInUp(valueRef.current))
          .add(slideInUp(sliderRef.current), 0.25)
          .add(slideInUp([maxRef.current, doubleRef.current]), 0.5)
          .add(slideInUp([minRef.current, repeatRef.current]), 0.75)
          .add(slideInUp(confirmRef.current), 1)
          .add(slideInRight(leaveRef.current), 0.25);

        break;

      default:
        break;
    }
  }, [currentAction]);

  const handleBet = (stake = sliderValue) => {
    console.log(stake);
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    setLogs((prevLogs) => [
      ...prevLogs,
      {
        time: `${hour}:${minute}`,
        msg: "You has joined to the game",
      },
    ]);
  };

  return (
    <Wrapper>
      <LeaveButton to="/" ref={leaveRef}>
        <Icon icon={faArrowLeft} />
        <Paragraph>Leave table</Paragraph>
      </LeaveButton>
      <TableText>
        <ReactArcText
          text="BLACKJACK PAYS 3 TO 2"
          direction={-1}
          arc={400}
          class="paragraph dark bold absolute first"
        />
        <ReactArcText
          text="Dealer must draw to 16, and stand on all 17's"
          direction={-1}
          arc={440}
          class="paragraph absolute second"
        />
      </TableText>
      <ChatContainer hide={true} ref={chatRef}>
        {logs.map(({ time, msg }, i) => (
          <ChatMsg
            key={i.toString()}
            hide={logs.length - 6 >= i}
            disappear={i !== logs.length - 1}
          >
            <BlueParagraph>[{time}]</BlueParagraph> {msg}
          </ChatMsg>
        ))}
      </ChatContainer>
      <ButtonGroup>
        <Button type="button" ref={minRef} onClick={() => handleBet(min)}>
          Min. ${min}
        </Button>
        <Button type="button" ref={maxRef} onClick={() => handleBet(max)}>
          Max. ${max}
        </Button>
        <SliderContainer>
          <Row>
            <Button
              type="button"
              ref={confirmRef}
              margin
              onClick={() => handleBet()}
            >
              CONFIRM
            </Button>
          </Row>
          <Row ref={sliderRef}>
            <Paragraph>${min}</Paragraph>
            <Slider
              type="range"
              min={min}
              max={max}
              value={sliderValue}
              onChange={(e) => setSliderValue(e.target.value)}
            />
            <Paragraph>${max}</Paragraph>
          </Row>
          <Row>
            <ButtonIcon
              type="button"
              disabled={parseFloat(sliderValue) <= min}
              onClick={() => {
                setSliderValue(parseFloat(sliderValue) - 1);
              }}
            >
              <Icon icon={faMinus} />
            </ButtonIcon>
            <Value ref={valueRef}>${sliderValue}</Value>
            <ButtonIcon
              type="button"
              disabled={parseFloat(sliderValue) >= max}
              onClick={() => {
                setSliderValue(parseFloat(sliderValue) + 1);
              }}
            >
              <Icon icon={faPlus} />
            </ButtonIcon>
          </Row>
        </SliderContainer>
        <Button
          type="button"
          ref={doubleRef}
          disabled={!lastStake}
          onClick={() => handleBet(lastStake * 2)}
        >
          DOUBLE {lastStake && `$${lastStake * 2}`}
        </Button>
        <Button
          type="button"
          ref={repeatRef}
          disabled={!lastStake}
          onClick={() => handleBet(lastStake * 2)}
        >
          REPEAT {lastStake && `$${lastStake}`}
        </Button>
      </ButtonGroup>
    </Wrapper>
  );
}

export default Single;
