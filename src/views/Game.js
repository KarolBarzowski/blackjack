import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { withRouter, Redirect, Link } from "react-router-dom";
import { gsap } from "gsap";
import { database, auth } from "helpers/firebase";
import { createDeck, shuffleDeck, deal } from "helpers/functions";
import { FadeIn } from "helpers/animations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import backgroundPattern from "assets/images/bg.png";
import { ReactComponent as Text } from "assets/images/text.svg";
import CountUp from "react-countup";
import Paragraph from "components/Paragraph";
import Loading from "components/Loading";
import Button from "components/Button";
import Deck from "components/Deck";
import Balance from "components/Balance";
import Modal from "components/Modal";
import ButtonIcon from "components/ButtonIcon";
import Card from "components/Card";
import Score from "components/Score";

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

const PlayerHand = styled.div``;

const DealerHand = styled.div``;

function Game({ userId }) {
  const leaveRef = useRef(null);
  const betControlsRef = useRef(null);
  const decisionControlsRef = useRef(null);
  const playerHandRef = useRef(null);
  const dealerHandRef = useRef(null);

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
  const [isGame, setIsGame] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [deck, setDeck] = useState(shuffleDeck(createDeck()));
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [isFlippedPlayer, setIsFlippedPlayer] = useState([]);
  const [isFlippedDealer, setIsFlippedDealer] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [prevPlayerScore, setPrevPlayerScore] = useState(0);
  const [playerTotalScore, setPlayerTotalScore] = useState(0);
  const [prevPlayerTotalScore, setPrevPlayerTotalScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [prevDealerScore, setPrevDealerScore] = useState(0);
  const [dealerTotalScore, setDealerTotalScore] = useState(0);
  const [prevDealerTotalScore, setPrevDealerTotalScore] = useState(0);
  const [isAcePlayer, setIsAcePlayer] = useState(false);
  const [isAceDealer, setIsAceDealer] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isStand, setIsStand] = useState(false);
  const [canDoubleDown, setCanDoubleDown] = useState(false);

  useEffect(() => {
    const handleDisableTab = (e) => {
      if (e.which === 9 || e.keyCode === 9) e.preventDefault();
    };

    document.addEventListener("keydown", handleDisableTab);

    return () => {
      document.removeEventListener("keydown", handleDisableTab);
    };
  }, []);

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
    if (!isGame) {
      if (balance <= 0) setIsBankrupt(true);
      else setIsBankrupt(false);
    }

    setIsAllIn(balance <= max);
    setCanDoubleBet(balance - lastStake * 2 >= 0 && lastStake * 2 <= max);
    setCanRepeatBet(balance - lastStake >= 0 && lastStake <= max);
    setCanDoubleDown(balance - stake * 2 >= 0);

    // update balance in database
    if (userId) {
      const ref = database.ref(`/users/${userId}`);
      ref.update({ balance });
    }

    setTimeout(() => {
      setPrevBalance(balance);
    }, 1750);

    // eslint-disable-next-line
  }, [balance, lastStake, isGame]);

  // listen for action change
  useEffect(() => {
    if (!isLoading) {
      gsap.defaults({ ease: "power2.inOut", duration: 0.75 });

      const stakeRef =
        betControlsRef.current.children[2].children[2].children[1];

      switch (currentAction) {
        case "bet":
          gsap
            .timeline()
            .to(decisionControlsRef.current, { y: 200 })
            .fromTo(betControlsRef.current, { y: 200 }, { y: 0 }, 0.25);

          break;

        case "decision":
          gsap
            .timeline()
            .to(betControlsRef.current, { y: 200 })
            .to(leaveRef.current, { x: -200 }, 0)
            .to(stakeRef, { y: -200, x: "50%" }, 1)
            .to(decisionControlsRef.current, { y: -45 })
            .call(
              () => {
                setIsDisabled(false);
              },
              null,
              5
            );

          handleDeal("player");
          setTimeout(() => {
            handleDeal("dealer", true);
            setTimeout(() => {
              handleDeal("player");
              setTimeout(() => {
                handleDeal("dealer", true);
              }, 1250);
            }, 1250);
          }, 1250);
          break;

        default:
          break;
      }
    }

    // eslint-disable-next-line
  }, [currentAction, isLoading]);

  useEffect(() => {
    // todo check if someone won

    setTimeout(() => {
      setPrevPlayerScore(playerScore);
      setPrevPlayerTotalScore(playerTotalScore);
      setPrevDealerScore(dealerScore);
      setPrevDealerTotalScore(dealerTotalScore);
    }, 1000);
  }, [playerScore, playerTotalScore, dealerScore, dealerTotalScore]);

  useEffect(() => {
    let score = 0;
    let totalScore = 0;
    let aces = 0;

    playerHand.forEach(({ value }) => {
      if (value === "A") {
        score += 1;
        totalScore += 11;
        aces += 1;
      } else if (typeof value === "string") {
        score += 10;
        totalScore += 10;
      } else {
        score += value;
        totalScore += value;
      }
    });

    setTimeout(() => {
      setPlayerScore(score);
      setPlayerTotalScore(totalScore);
      setIsAcePlayer(aces !== 0 && totalScore <= 21);
    }, 1000);

    if (playerHand.length) {
      const deckPos = {
        x: window.innerWidth * 0.96 - 144,
        y: window.innerHeight * 0.1,
      };

      const handPos = {
        x: window.innerWidth / 2 + 55 * (playerHand.length - 1) - 144,
        y: window.innerHeight - 432,
      };

      gsap.defaults({ ease: "power2.inOut", duration: 1.25 });
      gsap.set(playerHandRef.current.children[playerHand.length - 1], {
        x: deckPos.x,
        y: deckPos.y,
        autoAlpha: 1,
      });

      gsap
        .timeline()
        .to(
          playerHandRef.current.children[playerHand.length - 1],
          {
            x: handPos.x,
            y: handPos.y,
            rotate: Math.random() < 0.5 ? 3 : -3,
          },
          0
        )
        .call(
          () => {
            const newArray = isFlippedPlayer;
            newArray[playerHand.length - 1] = false;
            setIsFlippedPlayer(newArray);
          },
          null,
          0.25
        );
    }

    // eslint-disable-next-line
  }, [playerHand]);

  useEffect(() => {
    let score = 0;
    let totalScore = 0;
    let aces = 0;

    dealerHand.forEach(({ value }, i) => {
      if (i !== 1 || isStand) {
        if (value === "A") {
          score += 1;
          totalScore += 11;
          aces += 1;
        } else if (typeof value === "string") {
          score += 10;
          totalScore += 10;
        } else {
          score += value;
          totalScore += value;
        }
      }
    });

    setTimeout(() => {
      setDealerScore(score);
      setDealerTotalScore(totalScore);
      setIsAceDealer(aces !== 0 && totalScore <= 21);
    }, 1000);

    if (dealerHand.length) {
      const deckPos = {
        x: window.innerWidth * 0.96 - 144,
        y: window.innerHeight * 0.1,
      };

      const handPos = {
        x: window.innerWidth / 2 + 55 * (dealerHand.length - 1) - 144,
        y: 34,
      };

      gsap.defaults({ ease: "power2.inOut", duration: 1.25 });
      gsap.set(dealerHandRef.current.children[dealerHand.length - 1], {
        x: deckPos.x,
        y: deckPos.y,
        autoAlpha: 1,
      });

      gsap
        .timeline()
        .to(
          dealerHandRef.current.children[dealerHand.length - 1],
          {
            x: handPos.x,
            y: handPos.y,
            rotate: Math.random() < 0.5 ? 3 : -3,
          },
          0
        )
        .call(
          () => {
            const newArray = isFlippedDealer;
            newArray[dealerHand.length - 1] =
              dealerHand.length === 2 ? true : false;
            setIsFlippedDealer(newArray);
          },
          null,
          0.25
        );
    }

    // eslint-disable-next-line
  }, [dealerHand, isStand]);

  const handleDeal = (destination, isFlipped = false) => {
    const card = deal(deck);

    if (destination === "player") {
      setIsFlippedPlayer((prevFlipped) => [...prevFlipped, true]);
      setPlayerHand((prevHand) => [...prevHand, card]);
    } else {
      setIsFlippedDealer((prevFlipped) => [...prevFlipped, isFlipped]);
      setDealerHand((prevHand) => [...prevHand, card]);
    }
  };

  const handleBet = (bet) => {
    setIsGame(true);
    setIsDisabled(true);

    setBalance((prevBalance) => prevBalance - parseFloat(bet));

    setStake(parseFloat(bet));
    setTimeout(() => {
      setLastStake(parseFloat(bet));
    }, 1000);

    setCurrentAction("decision");
  };

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
      <PlayerHand ref={playerHandRef}>
        {playerHand.map(({ value, suit, color }, i) => (
          <Card
            key={i.toString()}
            isFlipped={isFlippedPlayer[i]}
            value={value}
            suit={suit}
            color={color}
          />
        ))}
      </PlayerHand>
      {playerScore !== 0 && (
        <Score
          isWin={winner === "player"}
          isLose={winner === "dealer"}
          isDraw={isDraw}
          player
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
      <DealerHand ref={dealerHandRef}>
        {dealerHand.map(({ value, suit, color }, i) => (
          <Card
            key={i.toString()}
            isFlipped={isFlippedDealer[i]}
            value={value}
            suit={suit}
            color={color}
          />
        ))}
      </DealerHand>
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
      <Controls ref={betControlsRef}>
        <Button
          type="button"
          onClick={() => handleBet(min)}
          disabled={isDisabled}
        >
          Min. ${min}
        </Button>

        <Button
          type="button"
          onClick={() => handleBet(isAllIn ? balance : max)}
          disabled={isDisabled}
        >
          {isAllIn ? `All in` : `Max. $${max}`}
        </Button>

        <SliderContainer>
          <Row>
            <Button
              type="button"
              margin
              onClick={() => handleBet(stake)}
              disabled={isDisabled}
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
              onChange={(e) => setStake(parseFloat(e.target.value))}
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
          disabled={!lastStake || isDisabled || !canDoubleBet}
          onClick={() => handleBet(lastStake * 2)}
        >
          DOUBLE {lastStake && `$${lastStake * 2}`}
        </Button>

        <Button
          type="button"
          disabled={!lastStake || isDisabled || !canRepeatBet}
          onClick={() => handleBet(lastStake)}
        >
          REPEAT {lastStake && `$${lastStake}`}
        </Button>
      </Controls>
      <Controls ref={decisionControlsRef}>
        <Button
          type="button"
          // onClick={() => handleBet(min)}
          disabled={isDisabled}
        >
          HIT
        </Button>

        <Button
          type="button"
          // onClick={() => handleBet(isAllIn ? balance : max)}
          disabled={isDisabled}
        >
          STAND
        </Button>

        <Button
          type="button"
          // onClick={() => handleBet(isAllIn ? balance : max)}
          disabled={isDisabled || !canDoubleDown}
        >
          DOUBLE {canDoubleDown && `$${stake * 2}`}
        </Button>
      </Controls>
    </Wrapper>
  );
}

export default Game;
