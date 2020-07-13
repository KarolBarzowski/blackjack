import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { db } from "helpers/firebase";
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

  const [balance, setBalance] = useState(0);
  const [prevBalance, setPrevBalance] = useState(0);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(300);
  const [isAllIn, setIsAllIn] = useState(false);
  const [sliderValue, setSliderValue] = useState(276 || min);
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
  const [prevDealerScore, setPrevDealerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [dealerTotalScore, setDealerTotalScore] = useState(0);
  const [canDouble, setCanDouble] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [canSplit, setCanSplit] = useState(false);
  const [isBlackjack, setIsBlackjack] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isStand, setIsStand] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isAce, setIsAce] = useState(false);

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
      const dbRef = db.collection("users").doc(userId);

      dbRef.onSnapshot((doc) => {
        if (doc.data()) {
          setBalance(doc.data().balance);
        } else {
          setBalance("Error");
        }
      });
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
          ],
          {
            y: 200,
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

        setFlippedDealer(() => 0);

        gsap
          .timeline()
          .add(slideOutDown([hitRef.current, splitRef.current]))
          .add(slideOutDown([doubleDownRef.current, standRef.current]), 0.25)
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
            msg: `Dealer ${dealerTotalScore}: ${dealerHand
              .map(({ value, suit }) => `${value}${suit} `)
              .join(" ")}`,
          },
          {
            time: `${hour}:${minute < 10 ? `0${minute}` : minute}`,
            msg: isDraw
              ? `Draw! Your hand ${playerScore}: ${playerHand
                  .map(({ value, suit }) => `${value}${suit}`)
                  .join(" ")}`
              : `You ${winner === "player" ? "won" : "lost"} $${
                  isBlackjack ? sliderValue * 1.5 : sliderValue
                } with ${playerScore}: ${playerHand
                  .map(({ value, suit }) => `${value}${suit}`)
                  .join(" ")}`,
          },
        ]);

        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAction]);

  useEffect(() => {
    if (balance <= max) setIsAllIn(true);
    else setIsAllIn(false);

    if (balance - sliderValue >= 0) {
      setCanDouble(true);
      setCanSplit(true);
    } else {
      setCanDouble(false);
      setCanSplit(false);
    }

    setTimeout(() => {
      setPrevBalance(balance);
    }, 1750);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, max]);

  useEffect(() => {
    switch (true) {
      case playerScore > 21:
      case dealerScore === 21:
        setWinner("dealer");
        break;
      case dealerScore > 21:
        setWinner("player");
        break;
      case playerScore === 21 && dealerScore < 21:
        setWinner("player");
        setIsBlackjack(true);
        break;

      default:
        break;
    }

    if (isStand && isEnd) {
      if (playerScore > dealerScore && playerScore < 21) {
        setWinner("player");
      } else if (playerScore < dealerScore && dealerScore < 21) {
        setWinner("dealer");
      } else if (playerScore === dealerScore) {
        setIsDraw(true);
      }
    }

    setTimeout(() => {
      setPrevPlayerScore(playerScore);
    }, 1000);
  }, [playerScore, dealerScore, isStand, isEnd]);

  useEffect(() => {
    if (isStand) {
      if (dealerScore <= 16 && !isAnimating) {
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
        }, 750);
      }

      if (dealerScore >= 17) {
        setIsEnd(true);
      }
    }

    setTimeout(() => {
      setPrevDealerScore(dealerScore);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerCardsCounter, dealerScore, deck, isAnimating, isStand]);

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
    playerHand.forEach(({ value }) => {
      if (value === "A") {
        score += score + 11 > 21 ? 1 : 11;
      } else if (typeof value === "string") {
        score += 10;
      } else {
        score += value;
      }
    });

    setTimeout(() => {
      setPlayerScore(score);
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

    dealerHand.forEach(({ value }, i) => {
      totalScore = getCardValue(value, score);
      if (i !== 1 || isStand) {
        score = getCardValue(value, score);
      }
    });

    setTimeout(() => {
      setDealerScore(score);
      setDealerTotalScore(totalScore);
    }, 1000);
  }, [dealerHand, isStand]);

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

    dealerHand.forEach(({ value }, i) => {
      score = getCardValue(value, score);
    });

    setDealerScore(score);
  };

  const handleHit = () => {
    setQueue((prevQueue) => [
      ...prevQueue,
      {
        destination: "player",
        card: deal(deck),
        number: playerCardsCounter + 1,
      },
    ]);
    setPlayerCardsCounter((prevCount) => prevCount + 1);
  };

  const handleStand = () => {
    setFlippedDealer([0, 0]);

    handleCountDealerScore();

    setIsStand(true);
  };

  const handleDoubleDown = () => {};

  const handleSplit = () => {};

  return (
    <Wrapper>
      {winner && (
        <Winner winner={winner} isBlackjack={isBlackjack} draw={isDraw} />
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
            <Score isWin={winner === "dealer"} isLose={winner === "player"}>
              <CountUp
                start={prevDealerScore}
                end={dealerScore}
                duration={1}
                delay={0}
              />
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
          {playerScore !== 0 && (
            <Score isWin={winner === "player"} isLose={winner === "dealer"}>
              <CountUp
                start={prevPlayerScore}
                end={playerScore}
                duration={1}
                delay={0}
              />
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
