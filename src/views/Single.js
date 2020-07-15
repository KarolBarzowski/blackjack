import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { database } from "helpers/firebase";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import CountUp from "react-countup";
import backgroundPattern from "assets/images/bg.png";
import { ReactComponent as Text } from "assets/images/text.svg";
import { createDeck, shuffleDeck, deal, getCardValue } from "helpers/functions";
import {
  SlideIn,
  animateDeal,
  slideInUp,
  slideInRight,
  slideOutDown,
  slideOutLeft,
  moveLeft,
  moveRight,
} from "helpers/animations";
import ButtonIcon from "components/ButtonIcon";
import Paragraph from "components/Paragraph";
import Button from "components/Button";
import Chat from "components/Chat";
import Balance from "components/Balance";
import Card from "components/Card";
import Reverse from "components/Reverse";
import Deck from "components/Deck";
import Score from "components/Score";
import Winner from "components/Winner";

import { dummyData } from "helpers/dummyData";

const Wrapper = styled.div`
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
  /* animation: ${SlideIn} 0.5s ease-in-out forwards; */
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

const StyledParagraph = styled(Paragraph)`
  margin: 0 1rem;
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
  top: 22%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  user-select: none;
`;

const ButtonGroup = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;

  ${({ absolute, left }) =>
    absolute &&
    css`
      position: absolute;
      top: 7.85rem;
      left: ${left ? "10.6rem" : "47.6rem"};
      z-index: 4;
    `}
`;

const LeaveButton = styled(Link)`
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  display: flex;
  align-items: center;
  background-color: transparent;
  text-decoration: none;
  transition: color 0.05s ease-in-out;

  ${StyledParagraph} {
    color: ${({ theme }) => theme.textSecondary};
  }

  ${Icon} {
    font-size: 2.4rem;
    color: ${({ theme }) => theme.textSecondary};
    transition: color 0.05s ease-in-out;
  }

  :hover {
    ${StyledParagraph} {
      color: ${({ theme }) => theme.text};
    }

    ${Icon} {
      color: ${({ theme }) => theme.text};
    }
  }
`;

const Table = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-between;
  height: calc(100vh - 23.3rem);
`;

const CardsPlaceholder = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  justify-content: center;
  min-width: 14.4rem;
  min-height: 23.3rem;
`;

const SplittedCardsPlaceholder = styled.div`
  position: absolute;
  bottom: 0;
  left: ${({ left }) => (left ? "-25.5rem" : "25.5rem")};
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  justify-content: center;
  min-width: 14.4rem;
  min-height: 23.3rem;
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
  const deckRef = useRef(null);
  const playerHandRef = useRef(null);
  const dealerHandRef = useRef(null);
  const hitRef = useRef(null);
  const standRef = useRef(null);
  const doubleDownRef = useRef(null);
  const splitRef = useRef(null);
  const balanceRef = useRef(null);
  const stakeRef = useRef(null);
  const scoreLeftRef = useRef(null);
  const scoreRightRef = useRef(null);
  const smallBtnsRef = useRef(null);
  const splittedLeftHandRef = useRef(null);
  const splittedRightHandRef = useRef(null);

  const [balance, setBalance] = useState(0);
  const [prevBalance, setPrevBalance] = useState(0);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(300);
  const [isAllIn, setIsAllIn] = useState(false);
  const [sliderValue, setSliderValue] = useState(20 || min);
  const [lastStake, setLastStake] = useState(null);
  const [currentAction, setCurrentAction] = useState("bet");
  const [logs, setLogs] = useState([]);
  const [deck, setDeck] = useState(shuffleDeck(createDeck()));
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [flippedPlayer, setFlippedPlayer] = useState([]);
  const [flippedDealer, setFlippedDealer] = useState([]);
  const [playerCardsCounter, setPlayerCardsCounter] = useState(1);
  const [dealerCardsCounter, setDealerCardsCounter] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [queue, setQueue] = useState([]);
  const [prevPlayerScore, setPrevPlayerScore] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [prevPlayerTotalScore, setPrevPlayerTotalScore] = useState(0);
  const [playerTotalScore, setPlayerTotalScore] = useState(0);
  const [prevDealerTotalScore, setPrevDealerTotalScore] = useState(0);
  const [prevDealerScore, setPrevDealerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [dealerTotalScore, setDealerTotalScore] = useState(0);
  const [canDouble, setCanDouble] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [isSplitted, setIsSplitted] = useState(false);
  const [canSplit, setCanSplit] = useState(false);
  const [isBlackjack, setIsBlackjack] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winnerSplitted, setWinnerSplitted] = useState([null, null]);
  const [isStand, setIsStand] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isAcePlayer, setIsAcePlayer] = useState(false);
  const [isAceDealer, setIsAceDealer] = useState(false);
  const [splittedDraw, setSplittedDraw] = useState([false, false]);
  const [splittedScore, setSplittedScore] = useState([0, 0]);
  const [prevSplittedScore, setPrevSplittedScore] = useState([0, 0]);
  const [splittedTotalScore, setSplittedTotalScore] = useState([0, 0]);
  const [prevSplittedTotalScore, setPrevSplittedTotalScore] = useState([0, 0]);
  const [currentSide, setCurrentSide] = useState(1);
  const [splittedHands, setSplittedHands] = useState([[], []]);
  const [flippedSplitted, setFlippedSplitted] = useState([[0], [0]]);
  const [isSplittedAce, setIsSplittedAce] = useState([false, false]);
  const [splittedCardsCounter, setSplittedCardsCounter] = useState([0, 0]);
  const [isSplittedBlackjack, setIsSplittedBlackjack] = useState([
    false,
    false,
  ]);
  const [isSplittedStand, setIsSplittedStand] = useState([false, false]);

  useEffect(() => {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();

    setLogs((prevLogs) => [
      ...prevLogs,
      {
        time: `${hour}:${minute < 10 ? `0${minute}` : minute}`,
        msg: "You have joined to the game",
      },
    ]);
  }, []);

  useEffect(() => {
    if (userId) {
      // const dbRef = db.collection("users").doc(userId);
      // dbRef.onSnapshot((doc) => {
      //   if (doc.data()) {
      //     setBalance(doc.data().balance);
      //   } else {
      //     setBalance("Error");
      //   }
      // });
    }
  }, [userId]);

  useEffect(() => {
    if (winner || isDraw) {
      setCurrentAction("win");
    }
  }, [winner, isDraw]);

  useEffect(() => {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();

    gsap.defaults({ duration: 0.75, ease: "power2.inOut" });

    switch (currentAction) {
      case "bet":
        gsap.set(
          [
            hitRef.current,
            standRef.current,
            doubleDownRef.current,
            splitRef.current,
            scoreLeftRef.current,
            scoreRightRef.current,
            smallBtnsRef.current,
          ],
          {
            autoAlpha: 0,
          }
        );

        gsap
          .timeline()
          .add(slideInUp(valueRef.current))
          .add(slideInUp(sliderRef.current), 0.25)
          .add(slideInUp([maxRef.current, doubleRef.current]), 0.5)
          .add(slideInUp([minRef.current, repeatRef.current]), 0.75)
          .add(slideInUp(confirmRef.current), 1)
          .add(slideInRight(leaveRef.current), 0.25);

        setLogs((prevLogs) => [
          ...prevLogs,
          {
            time: `${hour}:${minute < 10 ? `0${minute}` : minute}`,
            msg: "A new round has begun",
          },
        ]);

        break;
      case "decision":
        setIsAnimating(true);

        gsap
          .timeline()
          .add(
            slideOutDown([
              valueRef.current.children[0],
              valueRef.current.children[2],
            ])
          )
          .add(slideOutDown(sliderRef.current), 0.25)
          .add(slideOutDown([maxRef.current, doubleRef.current]), 0.5)
          .add(slideOutDown([minRef.current, repeatRef.current]), 0.75)
          .add(slideOutDown(confirmRef.current), 1)
          .add(slideOutLeft(leaveRef.current), 0.25)
          .call(
            () => {
              setIsAnimating(false);
              setQueue(dummyData);
              // setQueue([
              //   {
              //     destination: "player",
              //     card: deal(deck),
              //     number: 0,
              //   },
              //   {
              //     destination: "dealer",
              //     card: deal(deck),
              //     number: 0,
              //   },
              //   {
              //     destination: "player",
              //     card: deal(deck),
              //     number: 1,
              //   },
              //   {
              //     destination: "dealer",
              //     card: deal(deck),
              //     number: 1,
              //   },
              // ]);
            },
            null,
            "-=1"
          );

        gsap
          .timeline()
          .delay(4)
          .add(slideInUp([doubleDownRef.current, standRef.current]))
          .add(slideInUp([hitRef.current, splitRef.current]), 0.25);

        break;
      case "win":
        setIsAnimating(true);

        const balanceRect = balanceRef.current.getBoundingClientRect();
        const stakeRect = stakeRef.current.getBoundingClientRect();

        if (!isStand) handleHideButtons();

        gsap
          .timeline()
          .fromTo(
            stakeRef.current,
            { x: 0, y: 0 },
            {
              x:
                winner === "player" || isDraw
                  ? balanceRect.right - stakeRect.right
                  : 0,
              y:
                winner === "player" || isDraw
                  ? balanceRect.top - stakeRect.top
                  : 200,
              duration: winner === "player" || isDraw ? 1.75 : 0.75,
            }
          )
          .to(stakeRef.current, { autoAlpha: 0 })
          .call(() => {
            if (winner === "player") {
              setBalance(
                (prevBalance) =>
                  prevBalance +
                  parseFloat(sliderValue) +
                  parseFloat(sliderValue) * (isBlackjack ? 1.5 : 1)
              );
            } else if (isDraw) {
              setBalance(
                (prevBalance) => prevBalance + parseFloat(sliderValue)
              );
            }
          });

        setLogs((prevLogs) => [
          ...prevLogs,
          {
            time: `${hour}:${minute < 10 ? `0${minute}` : minute}`,
            msg: `Dealer ${
              isAceDealer ? dealerTotalScore : dealerScore
            }: ${dealerHand
              .map(({ value, suit }) => `${value}${suit} `)
              .join(" ")}`,
          },
          {
            time: `${hour}:${minute < 10 ? `0${minute}` : minute}`,
            msg: isDraw
              ? `Draw! Your hand ${
                  isAcePlayer ? playerTotalScore : playerScore
                }: ${playerHand
                  .map(({ value, suit }) => `${value}${suit}`)
                  .join(" ")}`
              : `You ${winner === "player" ? "won" : "lost"} $${
                  isBlackjack ? sliderValue * 1.5 : sliderValue
                } with ${
                  isAcePlayer ? playerTotalScore : playerScore
                }: ${playerHand
                  .map(({ value, suit }) => `${value}${suit}`)
                  .join(" ")}`,
          },
        ]);

        break;
      case "split":
        setIsSplitted(true);

        gsap
          .timeline()
          .set([scoreLeftRef.current, scoreRightRef.current], {
            autoAlpha: 1,
          })
          .set(smallBtnsRef.current, { x: 55, y: -40 })
          .to(smallBtnsRef.current, { autoAlpha: 1, duration: 0.75 })
          .add(moveLeft(playerHandRef.current.children[0]), 0)
          .add(moveLeft(scoreLeftRef.current), 0)
          .add(moveRight(playerHandRef.current.children[1]), 0)
          .add(moveRight(scoreRightRef.current), 0);

        break;

      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAction]);

  useEffect(() => {
    setIsAllIn(balance <= max);
    setCanSplit(balance - sliderValue >= 0);

    if (isSplitted) {
      setCanDouble(balance - sliderValue / 2 >= 0);
    } else {
      setCanDouble(balance - sliderValue >= 0);
    }

    setTimeout(() => {
      setPrevBalance(balance);
    }, 1750);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, max, isSplitted]);

  useEffect(() => {
    if (!isAnimating && !queue.length) {
      let whoWin = handleIsWinner();

      if (whoWin) {
        let newArray = [];
        flippedDealer.forEach(() => {
          newArray.push(0);
        });
        setFlippedDealer(newArray);

        handleCountDealerScore();

        setTimeout(() => {
          if (dealerTotalScore === 21 && playerTotalScore === 21) {
            whoWin = null;
            setIsDraw(true);
          } else
            setTimeout(() => {
              setWinner(whoWin);
            }, 500);
        }, 100);
      }
    }

    setTimeout(() => {
      setPrevPlayerScore(playerScore);
      setPrevPlayerTotalScore(playerTotalScore);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    playerScore,
    playerTotalScore,
    dealerScore,
    dealerTotalScore,
    isAnimating,
    isEnd,
  ]);

  useEffect(() => {
    if (isStand) {
      if (dealerScore <= 16 && dealerTotalScore <= 16 && !isAnimating) {
        setTimeout(() => {
          setQueue((prevQueue) => [
            ...prevQueue,
            {
              destination: "dealer",
              card: deal(deck),
              number: dealerCardsCounter + 1,
            },
          ]);

          setDealerCardsCounter((prevCount) => prevCount + 1);

          handleCountDealerScore();
        }, 500);
      }

      if (dealerScore >= 17 || dealerTotalScore >= 17) {
        setIsEnd(true);
      }
    }

    setTimeout(() => {
      setPrevDealerScore(dealerScore);
      setPrevDealerTotalScore(dealerTotalScore);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dealerCardsCounter,
    dealerScore,
    dealerTotalScore,
    deck,
    isAnimating,
    isStand,
  ]);

  useEffect(() => {
    if (!isAnimating && queue.length) {
      setIsAnimating(true);

      const { destination, card, number } = queue.shift();
      setQueue(queue);

      let handRef;
      if (destination === "player") {
        handRef = playerHandRef.current;
        setFlippedPlayer((prevFlipped) => [...prevFlipped, 1]);
        setPlayerHand((prevHand) => [...prevHand, card]);
      } else {
        handRef = dealerHandRef.current;
        setFlippedDealer((prevFlipped) => [...prevFlipped, 1]);
        setDealerHand((prevHand) => [...prevHand, card]);
      }

      setTimeout(() => {
        animateDeal(
          destination,
          number,
          deckRef.current,
          handRef,
          handleFlipCard,
          setIsAnimating
        );
      }, 10);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, isAnimating]);

  useEffect(() => {
    let score = 0;
    let totalScore = 0;
    let aces = [];

    playerHand.forEach(({ value }) => {
      if (value === "A") {
        aces.push(value);
      } else if (typeof value === "string") {
        score += 10;
      } else {
        score += value;
      }
    });

    totalScore = score;

    aces.forEach(() => {
      score += 1;
      totalScore += 11;
    });

    setTimeout(() => {
      setIsAcePlayer(aces.length && totalScore <= 21);
      setPlayerScore(score);
      setPlayerTotalScore(totalScore);
    }, 1000);

    if (playerHand.length === 2) {
      if (playerHand[0].value === "A" && playerHand[1].value === "A")
        setIsSplit(true);
      else if (
        typeof playerHand[0].value === "string" &&
        typeof playerHand[1].value === "string"
      )
        setIsSplit(true);
      else if (playerHand[0].value === playerHand[1].value) setIsSplit(true);
      else setIsSplit(false);
    } else setIsSplit(false);
  }, [playerHand]);

  useEffect(() => {
    let score = 0;
    let totalScore = 0;
    let aces = [];

    dealerHand.forEach(({ value }, i) => {
      if (i !== 1 || isStand) {
        if (value === "A") {
          aces.push(value);
        } else if (typeof value === "string") {
          score += 10;
        } else {
          score += value;
        }
      }
    });

    totalScore = score;

    aces.forEach(() => {
      score += 1;
      totalScore += 11;
    });

    setTimeout(() => {
      setIsAceDealer(aces.length && totalScore <= 21);
      setDealerScore(score);
      setDealerTotalScore(totalScore);
    }, 1000);
  }, [dealerHand, isStand]);

  useEffect(() => {
    let whoWin = winnerSplitted;

    switch (true) {
      case splittedScore[currentSide] > 21:
      case dealerScore === 21:
      case dealerTotalScore === 21:
        whoWin[currentSide] = "dealer";
        break;
      case dealerScore > 21:
        whoWin[currentSide] = "player";
        break;
      case splittedScore[currentSide] === 21 && dealerScore < 21:
      case splittedScore[currentSide] === 21 && dealerTotalScore < 21:
      case splittedTotalScore[currentSide] === 21 && dealerScore < 21:
      case splittedTotalScore[currentSide] === 21 && dealerTotalScore < 21:
        whoWin[currentSide] = "player";
        const newArray = isSplittedBlackjack;
        newArray[currentSide] = true;
        setIsSplittedBlackjack(newArray);
        break;

      default:
        break;
    }

    if (isSplittedStand[0] && isSplittedStand[1]) {
      if (isSplittedStand[0]) {
        switch (true) {
          case splittedScore[0] > dealerScore &&
            splittedScore[0] < 21 &&
            !isAceDealer:
          case splittedScore[0] > dealerTotalScore && splittedScore[0] < 21:
          case splittedTotalScore[0] > dealerScore &&
            splittedTotalScore[0] < 21 &&
            !isAceDealer:
          case splittedTotalScore[0] > dealerTotalScore &&
            splittedTotalScore[0] < 21:
            whoWin[0] = "player";
            break;
          case dealerScore > splittedScore[0] &&
            dealerScore < 21 &&
            !isAcePlayer:
          case dealerScore > splittedTotalScore[0] && dealerScore < 21:
          case dealerTotalScore > splittedScore[0] &&
            dealerTotalScore < 21 &&
            !isAcePlayer:
          case dealerTotalScore > splittedTotalScore[0] &&
            dealerTotalScore < 21:
            whoWin[0] = "dealer";
            break;
          case splittedScore[0] === dealerScore &&
            splittedTotalScore[0] < 21 &&
            dealerTotalScore < 21:
            whoWin[0] = null;
            setTimeout(() => {
              const newArray = splittedDraw;
              splittedDraw[0] = true;
              setSplittedDraw(newArray);
            }, 500);
            break;

          default:
            break;
        }
      }

      if (isSplittedStand[1]) {
        switch (true) {
          case splittedScore[1] > dealerScore &&
            splittedScore[1] < 21 &&
            !isAceDealer:
          case splittedScore[1] > dealerTotalScore && splittedScore[1] < 21:
          case splittedTotalScore[1] > dealerScore &&
            splittedTotalScore[1] < 21 &&
            !isAceDealer:
          case splittedTotalScore[1] > dealerTotalScore &&
            splittedTotalScore[1] < 21:
            whoWin[1] = "player";
            break;
          case dealerScore > splittedScore[1] &&
            dealerScore < 21 &&
            !isAcePlayer:
          case dealerScore > splittedTotalScore[1] && dealerScore < 21:
          case dealerTotalScore > splittedScore[1] &&
            dealerTotalScore < 21 &&
            !isAcePlayer:
          case dealerTotalScore > splittedTotalScore[1] &&
            dealerTotalScore < 21:
            whoWin[1] = "dealer";
            break;
          case splittedScore[1] === dealerScore &&
            splittedTotalScore[1] < 21 &&
            dealerTotalScore < 21:
            whoWin[1] = null;
            setTimeout(() => {
              const newArray = splittedDraw;
              splittedDraw[1] = true;
              setSplittedDraw(newArray);
            }, 500);
            break;

          default:
            break;
        }
      }
    }

    setTimeout(() => {
      setWinnerSplitted(whoWin);
    }, 500);

    setTimeout(() => {
      setPrevSplittedScore(splittedScore);
      setPrevSplittedTotalScore(splittedTotalScore);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    winnerSplitted,
    currentSide,
    splittedScore,
    splittedTotalScore,
    isSplittedStand,
  ]);

  useEffect(() => {
    let score = [0, 0];
    let totalScore = [0, 0];
    let aces = [[], []];

    splittedHands.forEach((hand, side) => {
      hand.forEach(({ value }) => {
        if (value === "A") {
          aces[side].push(value);
        } else if (typeof value === "string") {
          score[side] += 10;
          totalScore[side] += 10;
        } else {
          score[side] += value;
          totalScore[side] += value;
        }
      });
    });

    aces.forEach((hand, side) => {
      hand.forEach(() => {
        score[side] += 1;
        totalScore[side] += 11;
      });
    });
    setTimeout(() => {
      setIsSplittedAce([
        aces[0].length && totalScore[0] <= 21,
        aces[1].length && totalScore[1] <= 21,
      ]);
      setSplittedScore(score);
      setSplittedTotalScore(totalScore);
    }, 500);
  }, [splittedHands]);

  useEffect(() => {
    console.log("winner:", winnerSplitted);

    setTimeout(() => {
      if (winnerSplitted[0] || winnerSplitted[1]) {
        setIsAnimating(true);

        const balanceRect = balanceRef.current.getBoundingClientRect();
        const stakeRect = stakeRef.current.getBoundingClientRect();

        if (currentSide || winnerSplitted[1]) {
          // setCurrentSide(0);
          gsap.timeline().to(smallBtnsRef.current, {
            x: -465,
          });
        } else if (!currentSide && winnerSplitted[0]) {
          gsap.timeline().to(smallBtnsRef.current, {
            y: 200,
            autoAlpha: 0,
          });
        }

        if (winnerSplitted[currentSide] === "player") {
          setBalance(
            (prevBalance) =>
              prevBalance +
              (parseFloat(sliderValue) / 2) *
                (isSplittedBlackjack[currentSide] ? 1.5 : 1)
          );
        } else if (splittedDraw[currentSide]) {
          setBalance(
            (prevBalance) => prevBalance + parseFloat(sliderValue) / 2
          );
        }
        setCurrentSide(0);
        setIsAnimating(false);
      }
    }, 501);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSide, winnerSplitted[0], winnerSplitted[1], splittedScore]);

  useEffect(() => {
    if (isSplittedStand[0] && isSplittedStand[1]) {
      setFlippedDealer([0, 0]);
      handleCountDealerScore();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSplittedStand[0], isSplittedStand[1]]);

  const handleFlipCard = (destination, number) => {
    if (destination === "player") {
      const newArray = flippedPlayer;
      newArray[number] = 0;
      setFlippedPlayer(newArray);
    } else {
      const newArray = flippedDealer;
      newArray[number] = number === 1 ? 1 : 0;
      setFlippedDealer(newArray);
    }
  };

  const handleBet = (stake = parseFloat(sliderValue)) => {
    setCurrentAction("decision");
    setSliderValue(stake);
    setBalance(balance - stake);
  };

  const handleCountDealerScore = () => {
    let score = 0;
    let totalScore = 0;
    let aces = [];

    dealerHand.forEach(({ value }, i) => {
      if (value === "A") {
        aces.push(value);
      } else if (typeof value === "string") {
        score += 10;
      } else {
        score += value;
      }
    });

    totalScore = score;

    aces.forEach(() => {
      score += 1;
      totalScore += 11;
    });

    setIsAceDealer(aces.length && totalScore <= 21);
    setDealerScore(score);
    setDealerTotalScore(totalScore);
  };

  const handleIsWinner = () => {
    if (!isSplitted) {
      let whoWin = null;

      switch (true) {
        case playerScore > 21:
        case dealerScore === 21:
        case dealerTotalScore === 21:
          whoWin = "dealer";
          break;
        case dealerScore > 21:
          whoWin = "player";
          break;
        case playerScore === 21 && dealerScore < 21:
        case playerScore === 21 && dealerTotalScore < 21:
        case playerTotalScore === 21 && dealerScore < 21:
        case playerTotalScore === 21 && dealerTotalScore < 21:
          whoWin = "player";
          setIsBlackjack(true);
          break;

        default:
          break;
      }

      if (isStand && isEnd) {
        switch (true) {
          case playerScore > dealerScore && playerScore < 21 && !isAceDealer:
          case playerScore > dealerTotalScore && playerScore < 21:
          case playerTotalScore > dealerScore &&
            playerTotalScore < 21 &&
            !isAceDealer:
          case playerTotalScore > dealerTotalScore && playerTotalScore < 21:
            whoWin = "player";
            break;
          case dealerScore > playerScore && dealerScore < 21 && !isAcePlayer:
          case dealerScore > playerTotalScore && dealerScore < 21:
          case dealerTotalScore > playerScore &&
            dealerTotalScore < 21 &&
            !isAcePlayer:
          case dealerTotalScore > playerTotalScore && dealerTotalScore < 21:
            whoWin = "dealer";
            break;
          case playerScore === dealerScore &&
            playerTotalScore < 21 &&
            dealerTotalScore < 21:
            whoWin = null;
            setTimeout(() => {
              setIsDraw(true);
            }, 500);
            break;

          default:
            break;
        }
      }

      return whoWin;
    }
  };

  const handleHideButtons = () => {
    gsap
      .timeline()
      .add(slideOutDown([hitRef.current, splitRef.current]))
      .add(slideOutDown([doubleDownRef.current, standRef.current]), 0.25);
  };

  const handleHit = () => {
    if (isSplitted) {
      setIsAnimating(true);

      // const card = deal(deck);
      const card = {
        suit: "♠︎",
        value: "A",
        color: "black",
      };

      if (currentSide) {
        setFlippedSplitted((prevFlipped) => [
          [...prevFlipped[0]],
          [...prevFlipped[1], 1],
        ]);
        setSplittedHands((prevHand) => [
          [...prevHand[0]],
          [...prevHand[1], card],
        ]);
      } else {
        setFlippedSplitted((prevFlipped) => [
          [...prevFlipped[0], 1],
          [...prevFlipped[1]],
        ]);
        setSplittedHands((prevHand) => [
          [...prevHand[0], card],
          [...prevHand[1]],
        ]);
      }

      setTimeout(() => {
        gsap.defaults({ ease: "power3.inOut" });

        const deckPos = deckRef.current.getBoundingClientRect();

        let element, handPos;
        if (currentSide) {
          handPos = splittedRightHandRef.current.getBoundingClientRect();
          element = splittedRightHandRef.current;
        } else {
          handPos = splittedLeftHandRef.current.getBoundingClientRect();
          element = splittedLeftHandRef.current;
        }

        gsap
          .timeline()
          .fromTo(
            element.children[splittedCardsCounter[currentSide]],
            {
              x: deckPos.right - handPos.right,
              y: deckPos.top - handPos.top,
              visibility: "visible",
            },
            {
              x: 55 * (splittedCardsCounter[currentSide] + 1),
              y: 0,
              rotate: Math.random() < 0.5 ? 3 : -3,
              duration: 1.25,
            },
            -0.1
          )
          .call(
            () => {
              const newArray = flippedSplitted;
              newArray[currentSide][splittedCardsCounter[currentSide] + 1] = 0;
              setFlippedSplitted(newArray);
            },
            null,
            0.5
          )
          .call(() => {
            const newSplittedCardsCounter = splittedCardsCounter;
            newSplittedCardsCounter[currentSide] += 1;
            setSplittedCardsCounter(newSplittedCardsCounter);
            setIsAnimating(false);
          });
      }, 10);
    } else {
      setQueue((prevQueue) => [
        ...prevQueue,
        {
          destination: "player",
          card: deal(deck),
          number: playerCardsCounter + 1,
        },
      ]);
      setPlayerCardsCounter((prevCount) => prevCount + 1);
    }
  };

  const handleStand = () => {
    if (isSplitted) {
      if (currentSide) {
        setIsSplittedStand([false, true]);
        setCurrentSide(0);
        gsap.timeline().to(smallBtnsRef.current, {
          x: -465,
        });
      } else {
        if (isSplittedStand[1]) setIsSplittedStand([true, true]);
        else setIsSplittedStand([true, false]);

        gsap.timeline().to(smallBtnsRef.current, {
          y: 200,
          autoAlpha: 0,
        });
      }
    } else {
      handleHideButtons();
      setFlippedDealer([0, 0]);
      handleCountDealerScore();
      setIsStand(true);
    }
  };

  const handleDoubleDown = () => {
    handleHideButtons();
    setSliderValue((prevValue) => prevValue * 2);
    setBalance(balance - sliderValue);
    handleHit();

    setTimeout(() => {
      setFlippedDealer([0, 0]);
      handleCountDealerScore();
      setIsStand(true);
    }, 750);
  };

  const handleSplit = () => {
    handleHideButtons();
    setSliderValue((prevValue) => prevValue * 2);
    setBalance(balance - sliderValue);
    const [cardLeft, cardRight] = playerHand;
    setSplittedHands([[cardLeft], [cardRight]]);
    setCurrentAction("split");
  };

  return (
    <Wrapper>
      {(winner || isDraw) && (
        <Winner winner={winner} isBlackjack={isBlackjack} isDraw={isDraw} />
      )}
      <LeaveButton to="/" ref={leaveRef}>
        <Icon icon={faArrowLeft} />
        <StyledParagraph>Leave table</StyledParagraph>
      </LeaveButton>
      <Balance start={prevBalance} end={balance} ref={balanceRef} />
      <TableText>
        <Text />
      </TableText>
      <Chat logs={logs} />
      <Deck ref={deckRef}>
        <Reverse />
      </Deck>
      <Table>
        <CardsPlaceholder ref={dealerHandRef}>
          {dealerHand &&
            dealerHand.map(({ value, suit, color }, i) => (
              <Card
                value={value}
                suit={suit}
                color={color}
                isFlipped={flippedDealer[i]}
                key={i.toString()}
              />
            ))}
          {dealerScore !== 0 && (
            <Score
              isWin={winner === "dealer"}
              isLose={winner === "player"}
              isDraw={isDraw}
            >
              <CountUp
                start={prevDealerScore}
                end={dealerScore}
                duration={1}
                delay={0}
              />
              {isAceDealer ? (
                <>
                  {" "}
                  /{" "}
                  <CountUp
                    start={prevDealerTotalScore}
                    end={dealerTotalScore}
                    duration={1}
                    delay={0}
                  />
                </>
              ) : null}
            </Score>
          )}
        </CardsPlaceholder>
        <CardsPlaceholder ref={playerHandRef}>
          {playerHand &&
            playerHand.map(({ value, suit, color }, i) => (
              <Card
                value={value}
                suit={suit}
                color={color}
                isFlipped={flippedPlayer[i]}
                key={i.toString()}
              />
            ))}
          <SplittedCardsPlaceholder ref={splittedLeftHandRef} left>
            {splittedHands[0] &&
              splittedHands[0].map(({ value, suit, color }, i) =>
                i !== 0 ? (
                  <Card
                    value={value}
                    suit={suit}
                    color={color}
                    isFlipped={flippedSplitted[0][i]}
                    key={i.toString()}
                  />
                ) : null
              )}
          </SplittedCardsPlaceholder>
          <SplittedCardsPlaceholder ref={splittedRightHandRef}>
            {splittedHands[1] &&
              splittedHands[1].map(({ value, suit, color }, i) =>
                i !== 0 ? (
                  <Card
                    value={value}
                    suit={suit}
                    color={color}
                    isFlipped={flippedSplitted[1][i]}
                    key={i.toString()}
                  />
                ) : null
              )}
          </SplittedCardsPlaceholder>
          <Score
            ref={scoreLeftRef}
            isWin={winnerSplitted[0] === "player"}
            isLose={winnerSplitted[0] === "dealer"}
            isDraw={splittedDraw[0]}
            isStand={isSplittedStand[0]}
          >
            <CountUp
              start={prevSplittedScore[0]}
              end={splittedScore[0]}
              duration={1}
              delay={0}
            />
            {isSplittedAce[0] ? (
              <>
                {" "}
                /{" "}
                <CountUp
                  start={prevSplittedTotalScore[0]}
                  end={splittedTotalScore[0]}
                  duration={1}
                  delay={0}
                />
              </>
            ) : null}
          </Score>
          <Score
            ref={scoreRightRef}
            isWin={winnerSplitted[1] === "player"}
            isLose={winnerSplitted[1] === "dealer"}
            isDraw={splittedDraw[1]}
            isStand={isSplittedStand[1]}
          >
            <CountUp
              start={prevSplittedScore[1]}
              end={splittedScore[1]}
              duration={1}
              delay={0}
            />
            {isSplittedAce[1] ? (
              <>
                {" "}
                /{" "}
                <CountUp
                  start={prevSplittedTotalScore[1]}
                  end={splittedTotalScore[1]}
                  duration={1}
                  delay={0}
                />
              </>
            ) : null}
          </Score>
          {playerScore !== 0 && (
            <Score
              isWin={winner === "player"}
              isLose={winner === "dealer"}
              isDraw={isDraw}
              isHidden={isSplitted}
            >
              <CountUp
                start={prevPlayerScore}
                end={playerScore}
                duration={1}
                delay={0}
              />
              {isAcePlayer ? (
                <>
                  {" "}
                  /{" "}
                  <CountUp
                    start={prevPlayerTotalScore}
                    end={playerTotalScore}
                    duration={1}
                    delay={0}
                  />
                </>
              ) : null}
            </Score>
          )}
        </CardsPlaceholder>
      </Table>
      <ButtonGroup>
        <ButtonGroup>
          <Button
            type="button"
            ref={minRef}
            onClick={() => handleBet(min)}
            disabled={isAnimating}
          >
            Min. ${min}
          </Button>

          <Button
            type="button"
            ref={maxRef}
            onClick={() => handleBet(isAllIn ? balance : max)}
            disabled={isAnimating}
          >
            {isAllIn ? `All in` : `Max. $${max}`}
          </Button>
        </ButtonGroup>

        <ButtonGroup absolute left>
          <Button
            type="button"
            ref={hitRef}
            onClick={handleHit}
            disabled={isAnimating}
          >
            HIT
          </Button>

          <Button
            type="button"
            ref={standRef}
            onClick={handleStand}
            disabled={isAnimating}
          >
            STAND
          </Button>
        </ButtonGroup>

        <SliderContainer>
          <Row ref={confirmRef}>
            <Button
              type="button"
              margin
              onClick={() => handleBet()}
              disabled={isAnimating}
            >
              CONFIRM
            </Button>
          </Row>
          <Row ref={sliderRef}>
            <StyledParagraph>${min}</StyledParagraph>
            <Slider
              type="range"
              min={min}
              max={isAllIn ? balance : max}
              value={sliderValue}
              onChange={(e) => setSliderValue(e.target.value)}
            />
            <StyledParagraph>${isAllIn ? balance : max}</StyledParagraph>
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
            <Value ref={stakeRef}>${sliderValue}</Value>
            <ButtonIcon
              type="button"
              disabled={parseFloat(sliderValue) >= (isAllIn ? balance : max)}
              onClick={() => {
                setSliderValue(parseFloat(sliderValue) + 1);
              }}
            >
              <Icon icon={faPlus} />
            </ButtonIcon>
          </Row>
        </SliderContainer>

        <ButtonGroup>
          <Button
            type="button"
            ref={doubleRef}
            disabled={!lastStake || isAnimating}
            onClick={() => handleBet(lastStake * 2)}
          >
            DOUBLE {lastStake && `$${lastStake * 2}`}
          </Button>

          <Button
            type="button"
            ref={repeatRef}
            disabled={!lastStake || isAnimating}
            onClick={() => handleBet(lastStake * 2)}
          >
            REPEAT {lastStake && `$${lastStake}`}
          </Button>
        </ButtonGroup>

        <ButtonGroup absolute right>
          <Button
            type="button"
            ref={doubleDownRef}
            onClick={handleDoubleDown}
            disabled={!canDouble || isAnimating}
          >
            DOUBLE {canDouble && `$${sliderValue}`}
          </Button>

          <Button
            type="button"
            ref={splitRef}
            onClick={handleSplit}
            disabled={!canSplit || !isSplit || isAnimating}
          >
            SPLIT {canSplit && `$${sliderValue}`}
          </Button>
        </ButtonGroup>

        <ButtonGroup absolute ref={smallBtnsRef}>
          <Button
            type="button"
            disabled={isAnimating}
            onClick={handleHit}
            small
          >
            HIT
          </Button>
          <Button
            type="button"
            disabled={isAnimating}
            onClick={handleStand}
            small
          >
            STAND
          </Button>
          <Button
            type="button"
            disabled={isAnimating || !canDouble}
            onClick={handleDoubleDown}
            small
          >
            DOUBLE {canDouble && `$${sliderValue / 2}`}
          </Button>
        </ButtonGroup>
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
