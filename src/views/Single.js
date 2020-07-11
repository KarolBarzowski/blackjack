import React, { useState, useEffect, useRef, createRef } from "react";
import styled, { keyframes, css } from "styled-components";
import PropTypes from "prop-types";
import { db } from "helpers/firebase";
import { createDeck, shuffleDeck, deal } from "helpers/functions";
import backgroundPattern from "assets/images/bg.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import ReactArcText from "react-arc-text-fix";
import CountUp from "react-countup";
import { gsap } from "gsap";
import ReactCardFlip from "react-card-flip";

const SlideIn = keyframes`
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
`;

const SlideInLeft = keyframes`
  from {
    transform: translateX(100%);
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
  padding: 5.5rem 1.5rem;
  display: flex;
  flex-flow: column nowrap;
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
  min-width: 12.5rem;
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
  z-index: 2;
  opacity: 0.38;

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
      opacity: 0;
    `}
`;

const BlueParagraph = styled.span`
  color: ${({ theme }) => theme.blue};
  padding: 0;
  margin: 0;
  font-weight: 500;
`;

const Table = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-between;
  height: calc(100vh - 28.8rem);
`;

const CardsPlaceholder = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  min-width: 14.4rem;
  min-height: 23.3rem;
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
`;

const Balance = styled(Paragraph)`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.21);
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  z-index: 1;
  animation: ${SlideInLeft} 0.75s ease-in-out forwards;

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

const CardValue = styled.p`
  font-family: "Montserrat", sans-serif;
  font-size: 3.4rem;
  font-weight: 600;
  color: ${({ color, theme }) => theme[color]};
  margin: 0;

  ${({ big }) =>
    big &&
    css`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 14.4rem;
    `}

  ${({ small }) =>
    small &&
    css`
      margin: -1.5rem 0 0 0.1rem;
      font-size: 4rem;
    `}
`;

const Card = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-between;
  height: 23.3rem;
  width: 14.4rem;
  padding: 0 0.5rem;
  background-color: #ffffff;
  box-shadow: 0.3rem -0.3rem 5px rgba(0, 0, 0, 0.16),
    0.3rem -0.3rem 5px rgba(0, 0, 0, 0.23);
  border-radius: 1rem;
  user-select: none;
`;

const Top = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  width: 100%;
  user-select: none;
`;

const Bottom = styled(Top)`
  transform: rotate(180deg);
`;

const Deck = styled.div`
  position: absolute;
  top: 25vh;
  right: 5%;
  height: 23.3rem;
  width: 14.4rem;
  padding: 1rem;
  box-shadow: 2.2rem -2.2rem 1rem 1rem rgba(0, 0, 0, 0.34),
    -3rem 3rem 1rem rgba(0, 0, 0, 0.34);
  background-color: #ffffff;
  /* transform: rotate(-30deg) skew(25deg); */
  border-radius: 0 1rem 0 0;

  ::before {
    content: "";
    position: absolute;
    top: 2.6rem;
    left: -5.2rem;
    height: 100%;
    width: 5.2rem;
    background: #ffffff;
    transform: rotate(0deg) skewY(-45deg);
  }

  ::after {
    content: "";
    position: absolute;
    bottom: -5.2rem;
    left: -2.6rem;
    height: 5.2rem;
    width: 100%;
    background: #ffffff;
    transform: rotate(0deg) skewX(-45deg);
  }
`;

const Reverse = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  height: calc(100% - 1rem);
  width: calc(100% - 1rem);
  border: 0.2rem solid #000000;
  border-radius: 1rem;
  background-image: linear-gradient(
    45deg,
    #000000 16.67%,
    #ffffff 16.67%,
    #ffffff 50%,
    #000000 50%,
    #000000 66.67%,
    #ffffff 66.67%,
    #ffffff 100%
  );
  background-size: 12px 12px;
`;

const CardWrapper = styled.div`
  position: absolute;
  visibility: hidden;
`;

function Single({ userId }) {
  const valueRef = useRef(null);
  const minRef = useRef(null);
  const maxRef = useRef(null);
  const confirmRef = useRef(null);
  const doubleRef = useRef(null);
  const repeatRef = useRef(null);
  const sliderRef = useRef(null);
  const leaveRef = useRef(null);
  const chatRef = useRef(null);
  const chatTimer = useRef(null);
  const deckRef = useRef(null);
  const playerHandRef = useRef(null);
  const dealerHandRef = useRef(null);

  const [balance, setBalance] = useState(0);
  const [prevBalance, setPrevBalance] = useState(0);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(300);
  const [isAllIn, setIsAllIn] = useState(false);
  const [sliderValue, setSliderValue] = useState(min);
  const [lastStake, setLastStake] = useState(null);
  const [currentAction, setCurrentAction] = useState("bet");
  const [logs, setLogs] = useState([]);
  const [isChatHidden, setIsChatHidden] = useState(false);
  const [deck, setDeck] = useState(shuffleDeck(createDeck()));
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [flippedPlayer, setFlippedPlayer] = useState([]);
  const [flippedDealer, setFlippedDealer] = useState([]);
  const [playerCardsCounter, setPlayerCardsCounter] = useState(1);
  const [dealerCardsCounter, setDealerCardsCounter] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();

    setLogs((prevLogs) => [
      ...prevLogs,
      {
        time: `${hour}:${minute < 10 ? `0${minute}` : minute}`,
        msg: "You has joined to the game",
      },
    ]);

    chatTimer.current = setTimeout(() => {
      setIsChatHidden(true);
    }, 5000);

    return () => clearTimeout(chatTimer.current);
  }, []);

  useEffect(() => {
    if (userId) {
      const dbRef = db.collection("users").doc(userId);

      dbRef.onSnapshot((doc) => {
        setBalance(doc.data().balance);
      });
    }
  }, [userId]);

  useEffect(() => {
    clearTimeout(chatTimer);
    setIsChatHidden(false);
    chatTimer.current = setTimeout(() => {
      setIsChatHidden(true);
    }, 5000);
  }, [logs]);

  useEffect(() => {
    console.log("currentAction:", currentAction); // REMOVE

    gsap.defaults({ duration: 0.75, ease: "power2.inOut" });

    switch (currentAction) {
      case "bet":
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

        const betTl = gsap
          .timeline()
          .add(slideInUp(valueRef.current))
          .add(slideInUp(sliderRef.current), 0.25)
          .add(slideInUp([maxRef.current, doubleRef.current]), 0.5)
          .add(slideInUp([minRef.current, repeatRef.current]), 0.75)
          .add(slideInUp(confirmRef.current), 1)
          .add(slideInRight(leaveRef.current), 0.25);

        break;
      case "decision":
        const slideOutDown = (element) => {
          const tl = gsap.timeline();

          tl.fromTo(
            element,
            {
              opacity: 1,
              y: 0,
            },
            { y: 200, opacity: 0 }
          );

          return tl;
        };

        const slideOutLeft = (element) => {
          const tl = gsap.timeline();

          tl.fromTo(
            element,
            {
              x: 0,
            },
            {
              x: "-=200px",
            }
          );

          return tl;
        };

        const decisionTl = gsap
          .timeline()
          .add(slideOutDown(valueRef.current))
          .add(slideOutDown(sliderRef.current), 0.25)
          .add(slideOutDown([maxRef.current, doubleRef.current]), 0.5)
          .add(slideOutDown([minRef.current, repeatRef.current]), 0.75)
          .add(slideOutDown(confirmRef.current), 1)
          .add(slideOutLeft(leaveRef.current), 0.25);

        // // deal 2 cards to player
        // setPlayerHand([deal(deck), deal(deck)]);
        // setPlayerCardsCounter(0);
        // setTimeout(() => {
        //   setPlayerCardsCounter(1);
        // }, 500);

        // // deal 2 cards to dealer
        // setDealerHand([deal(deck), deal(deck)]);
        // setDealerCardsCounter(0);
        // setDealerCardsCounter(1);

        // add to queue 2 cards for player, 2 for dealer

        setQueue([
          {
            destination: "player",
            card: deal(deck),
            number: 0,
          },
          {
            destination: "dealer",
            card: deal(deck),
            number: 0,
          },
          {
            destination: "player",
            card: deal(deck),
            number: 1,
          },
          {
            destination: "dealer",
            card: deal(deck),
            number: 1,
          },
        ]);

        // setTimeout(() => {
        //   const newArray = flippedPlayer;
        //   newArray[0] = 0;
        //   setFlippedPlayer(newArray);
        // }, 750);
        // setTimeout(() => {
        //   const newArray = flippedPlayer;
        //   newArray[1] = 0;
        //   setFlippedPlayer(newArray);
        // }, 2750);
        // setTimeout(() => {
        //   setPlayerHand((prevHand) => [...prevHand, deal(deck)]);
        // }, 2000);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAction]);

  useEffect(() => {
    if (balance <= max) setIsAllIn(true);
    else setIsAllIn(false);

    setTimeout(() => {
      setPrevBalance(balance);
    }, 1750);
  }, [balance, max]);

  useEffect(() => {
    console.log("currentqueue:", queue);
    if (!isAnimating && queue.length) {
      setIsAnimating(true);

      const { destination, card, number } = queue.shift();
      setQueue(queue);

      if (destination === "player")
        setPlayerHand((prevHand) => [...prevHand, card]);
      else setDealerHand((prevHand) => [...prevHand, card]);

      setTimeout(() => {
        animateDeal(destination, number);
      }, 500);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, isAnimating]);

  useEffect(() => {
    if (playerHand.length)
      setFlippedPlayer((prevFlipped) => [...prevFlipped, 1]);
  }, [playerHand]);

  useEffect(() => {
    if (dealerHand.length)
      setFlippedDealer((prevFlipped) => [...prevFlipped, 1]);
  }, [dealerHand]);

  const animateDeal = (destination, number) => {
    gsap.defaults({ ease: "power2.inOut" });

    const dealCard = (element) => {
      console.log(element);
      const deckRect = deckRef.current.getBoundingClientRect();
      let handRect;
      if (destination === "player")
        handRect = playerHandRef.current.getBoundingClientRect();
      else handRect = dealerHandRef.current.getBoundingClientRect();

      const tl = gsap.timeline();

      tl.fromTo(
        element,
        {
          x: deckRect.right - handRect.right,
          y: deckRect.top - handRect.top,
          visibility: "visible",
        },
        {
          x: number > 0 ? 55 : 0,
          y: 0,
          rotate: Math.random() < 0.5 ? 3 : -3,
          duration: 1.5,
        },
        0
      ).call(
        () => {
          if (destination === "player") {
            const newArray = flippedPlayer;
            newArray[number] = 0;
            setFlippedPlayer(newArray);
          } else {
            const newArray = flippedDealer;
            newArray[number] = 0;
            setFlippedDealer(newArray);
          }
        },
        null,
        0.75
      );

      return tl;
    };

    if (destination === "player") {
      const masterTl = gsap
        .timeline()
        .add(dealCard(playerHandRef.current.children[number]))
        .call(() => {
          setIsAnimating(false);
        });
    } else {
      const masterTl = gsap
        .timeline()
        .add(dealCard(dealerHandRef.current.children[number]))
        .call(() => {
          setIsAnimating(false);
        });
    }
  };

  // useEffect(() => {
  //   const number = playerCardsCounter;

  //   setIsAnimating(true);

  //   const newArray = flippedPlayer;
  //   newArray[number] = 1;
  //   setFlippedPlayer(newArray);

  //   gsap.defaults({ duration: 0.75, ease: "power2.inOut" });

  //   const dealCard = (element) => {
  //     const deckRect = deckRef.current.getBoundingClientRect();
  //     const handRect = playerHandRef.current.getBoundingClientRect();

  //     console.log(deckRect.right, handRect.right);

  //     const tl = gsap.timeline();
  //     tl.set(element, { autoAlpha: 0 });

  //     tl.fromTo(
  //       element,
  //       {
  //         x: deckRect.right - handRect.right,
  //         y: deckRect.top - handRect.top,
  //         autoAlpha: 1,
  //       },
  //       {
  //         x: number > 0 ? -89 : 0,
  //         y: 0,
  //         rotate: Math.random() < 0.5 ? 3 : -3,
  //         duration: 1.75,
  //       }
  //     ).call(() => {
  //       const newArray = flippedPlayer;
  //       newArray[number] = 0;
  //       setFlippedPlayer(newArray);
  //     });

  //     return tl;
  //   };

  //   const masterTl = gsap
  //     .timeline()
  //     .add(dealCard(playerHandRef.current.children[number]))
  //     .call(() => {
  //       setIsAnimating(false);
  //     });

  //   console.log("update");
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [playerCardsCounter]);

  const handleBet = (stake = parseFloat(sliderValue)) => {
    // REMOVE \/
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();

    setLogs((prevLogs) => [
      ...prevLogs,
      {
        time: `${hour}:${minute < 10 ? `0${minute}` : minute}`,
        msg: "Decision stage called",
      },
    ]);
    // REMOVE /\

    setCurrentAction("decision");
  };

  const handleChatAppear = () => {
    clearTimeout(chatTimer.current);
    setIsChatHidden(false);
  };

  const handleChatDisappear = () => {
    chatTimer.current = setTimeout(() => {
      setIsChatHidden(true);
    }, 5000);
  };

  return (
    <Wrapper>
      <LeaveButton to="/" ref={leaveRef}>
        <Icon icon={faArrowLeft} />
        <Paragraph>Leave table</Paragraph>
      </LeaveButton>
      <Balance>
        <Tooltip>Balance:</Tooltip>
        $
        <CountUp start={prevBalance} end={balance} duration={1.75} delay={0} />
      </Balance>
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
      <ChatContainer
        hide={isChatHidden}
        ref={chatRef}
        onMouseOver={handleChatAppear}
        onMouseOut={handleChatDisappear}
      >
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
      <Deck ref={deckRef}>
        <Reverse />
      </Deck>
      <Table>
        <CardsPlaceholder ref={dealerHandRef}>
          {dealerHand &&
            dealerHand.map(({ value, suit, color }, i) => (
              <CardWrapper>
                <ReactCardFlip isFlipped={flippedDealer[i]}>
                  <Card>
                    <Top>
                      <CardValue color={color}>{value}</CardValue>
                      <CardValue small color={color}>
                        {suit}
                      </CardValue>
                    </Top>
                    <CardValue big color={color}>
                      {suit}
                    </CardValue>
                    <Bottom>
                      <CardValue color={color}>{value}</CardValue>
                      <CardValue small color={color}>
                        {suit}
                      </CardValue>
                    </Bottom>
                  </Card>

                  <Card>
                    <Reverse />
                  </Card>
                </ReactCardFlip>
              </CardWrapper>
            ))}
        </CardsPlaceholder>
        <CardsPlaceholder ref={playerHandRef}>
          {playerHand &&
            playerHand.map(({ value, suit, color }, i) => (
              <CardWrapper>
                <ReactCardFlip isFlipped={flippedPlayer[i]}>
                  <Card>
                    <Top>
                      <CardValue color={color}>{value}</CardValue>
                      <CardValue small color={color}>
                        {suit}
                      </CardValue>
                    </Top>
                    <CardValue big color={color}>
                      {suit}
                    </CardValue>
                    <Bottom>
                      <CardValue color={color}>{value}</CardValue>
                      <CardValue small color={color}>
                        {suit}
                      </CardValue>
                    </Bottom>
                  </Card>

                  <Card>
                    <Reverse />
                  </Card>
                </ReactCardFlip>
              </CardWrapper>
            ))}
        </CardsPlaceholder>
      </Table>
      <ButtonGroup>
        <Button type="button" ref={minRef} onClick={() => handleBet(min)}>
          Min. ${min}
        </Button>
        <Button
          type="button"
          ref={maxRef}
          onClick={() => handleBet(isAllIn ? balance : max)}
        >
          {isAllIn ? `All in` : `Max. $${max}`}
        </Button>
        <SliderContainer>
          <Row ref={confirmRef}>
            <Button type="button" margin onClick={() => handleBet()}>
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
          <Row ref={valueRef}>
            <ButtonIcon
              type="button"
              disabled={parseFloat(sliderValue) <= min}
              onClick={() => {
                setSliderValue(parseFloat(sliderValue) - 1);
              }}
            >
              <Icon icon={faMinus} />
            </ButtonIcon>
            <Value>${sliderValue}</Value>
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

Single.propTypes = {
  userId: PropTypes.string,
};

Single.defaultProps = {
  userId: null,
};

export default Single;
