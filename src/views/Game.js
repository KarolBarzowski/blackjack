import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
import { gsap } from 'gsap';
import { database } from 'helpers/firebase';
import { createDeck, shuffleDeck, deal, getLabel } from 'helpers/functions';
import { FadeIn } from 'helpers/animations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import backgroundPattern from 'assets/images/bg.png';
import { ReactComponent as Text } from 'assets/images/text.svg';
import CountUp from 'react-countup';
import Paragraph from 'components/Paragraph';
import Loading from 'components/Loading';
import Button from 'components/Button';
import Deck from 'components/Deck';
import Balance from 'components/Balance';
import Modal from 'components/Modal';
import ButtonIcon from 'components/ButtonIcon';
import Card from 'components/Card';
import Score from 'components/Score';
import Winner from 'components/Winner';
import Chat from 'components/Chat';

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
    content: '';
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
  padding: 0.4rem 0.8rem;
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
  const stakeRef = useRef(null);

  const [min, setMin] = useState(1);
  const [max, setMax] = useState(300);
  const [stake, setStake] = useState(min);
  const [lastStake, setLastStake] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prevBalance, setPrevBalance] = useState(0);
  const [balance, setBalance] = useState(null);
  const [isBankrupt, setIsBankrupt] = useState(false);
  const [currentAction, setCurrentAction] = useState('bet');
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isBlackjack, setIsBlackjack] = useState(false);
  const [logs, setLogs] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const minStake = parseFloat(window.localStorage.getItem('min')) || 1;
    const maxStake = parseFloat(window.localStorage.getItem('max')) || 300;

    switch (true) {
      case minStake === 1:
      case minStake === 500:
      case minStake === 3000:
      case minStake === 10000:
      case minStake === 15000:
        setMin(minStake);
        setStake(minStake);
        break;

      default:
        history.push('/');
        break;
    }

    switch (true) {
      case maxStake === 300:
      case maxStake === 1500:
      case maxStake === 9000:
      case maxStake === 15000:
      case maxStake === 30000:
        setMax(maxStake);
        break;

      default:
        history.push('/');
        break;
    }
  }, [history]);

  useEffect(() => {
    const handleDisableTab = (e) => {
      if (e.which === 9 || e.keyCode === 9) e.preventDefault();
    };

    document.addEventListener('keydown', handleDisableTab);

    return () => {
      document.removeEventListener('keydown', handleDisableTab);
    };
  }, []);

  // read user balance
  useEffect(() => {
    if (userId) {
      const ref = database.ref(`/users/${userId}/balance`);

      ref.once('value').then((snapshot) => {
        setBalance(snapshot.val());
        setIsLoading(false);
      });
    }
  }, [userId]);

  // listen for balance change, update balance in database
  useEffect(() => {
    // check if player bankrupted
    if (!isGame) {
      if (balance <= 0) {
        setIsBankrupt(true);
        setIsDisabled(true);
      } else {
        setIsBankrupt(false);
        setIsDisabled(false);
      }
    }

    setIsAllIn(balance <= max);
    setCanDoubleBet(balance - lastStake * 2 >= 0 && lastStake * 2 <= max);
    setCanRepeatBet(balance - lastStake >= 0 && lastStake <= max);
    setCanDoubleDown(balance - stake >= 0);

    // update balance in database
    if (userId && balance !== null) {
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
      const date = new Date();
      const hour = date.getHours();
      const minute = date.getMinutes();

      gsap.defaults({ ease: 'power2.inOut', duration: 0.75 });

      switch (currentAction) {
        case 'bet':
          gsap
            .timeline()
            .to(decisionControlsRef.current, { y: 200 })
            .fromTo(betControlsRef.current, { y: 200 }, { y: 0 }, 0.25);

          break;

        case 'decision':
          gsap
            .timeline()
            .to(betControlsRef.current, { y: 200 })
            .to(leaveRef.current, { x: -200 }, 0)
            .to(stakeRef.current, { y: -200, x: '50%' }, 1)
            .to(decisionControlsRef.current, { y: -45 })
            .call(
              () => {
                setIsDisabled(false);
              },
              null,
              5,
            );

          handleDeal('player');
          setTimeout(() => {
            handleDeal('dealer', true);
            setTimeout(() => {
              handleDeal('player');
              setTimeout(() => {
                handleDeal('dealer', true);
              }, 1250);
            }, 1250);
          }, 1250);
          break;

        case 'stand':
          setIsDisabled(true);

          setIsAnimating(true);

          setIsFlippedDealer([false, false]);

          setIsStand(true);

          gsap.timeline().to(decisionControlsRef.current, { y: 200 });

          break;

        case 'win':
          setIsAnimating(true);
          setIsDisabled(true);

          if (winner === 'player') {
            setBalance(
              (prevBalance) =>
                prevBalance + parseFloat(stake) + parseFloat(stake) * (isBlackjack ? 1.5 : 1),
            );
          } else if (isDraw) {
            setBalance((prevBalance) => prevBalance + parseFloat(stake));
          }

          setLogs((prevLogs) => [
            ...prevLogs,
            {
              time: `${hour}:${minute < 10 ? `0${minute}` : minute}`,
              msg: `Dealer ${isAceDealer ? dealerTotalScore : dealerScore}: ${dealerHand
                .map(({ value, suit }) => `${value}${suit} `)
                .join(' ')}`,
            },
            {
              time: `${hour}:${minute < 10 ? `0${minute}` : minute}`,
              msg: isDraw
                ? `Draw! Your hand ${
                    isAcePlayer ? playerTotalScore : playerScore
                  }: ${playerHand.map(({ value, suit }) => `${value}${suit}`).join(' ')}`
                : `You ${winner === 'player' ? 'won' : 'lost'} $${
                    isBlackjack ? getLabel(stake * 1.5) : getLabel(stake)
                  } with ${isAcePlayer ? playerTotalScore : playerScore}: ${playerHand
                    .map(({ value, suit }) => `${value}${suit}`)
                    .join(' ')}`,
            },
          ]);

          // eslint-disable-next-line
          const tl = gsap.timeline();

          if (!isStand) {
            tl.to(decisionControlsRef.current, {
              y: 200,
            });
          }

          Array.from(playerHandRef.current.children).forEach((child, i) => {
            tl.to(
              playerHandRef.current.children[i],
              {
                x: `-=${55 * i}`,
                rotate: 0,
              },
              0,
            );
          });

          Array.from(dealerHandRef.current.children).forEach((child, i) => {
            tl.to(
              dealerHandRef.current.children[i],
              {
                x: `-=${55 * i}`,
                rotate: 0,
              },
              0,
            );
          });

          tl.to([...playerHandRef.current.children, ...dealerHandRef.current.children], {
            x: 144,
            y: -250,
            duration: 1,
          })
            .to(leaveRef.current, { x: 0 })
            .to(stakeRef.current, { y: 0, x: 0 })
            .call(
              () => {
                setIsGame(false);
                setPlayerHand([]);
                setDealerHand([]);
                setIsFlippedPlayer([]);
                setIsFlippedDealer([]);
                setIsAcePlayer(false);
                setPlayerScore(0);
                setPrevPlayerScore(0);
                setPlayerTotalScore(0);
                setPrevPlayerTotalScore(0);
                setIsAceDealer(false);
                setDealerScore(0);
                setDealerTotalScore(0);
                setPrevDealerScore(0);
                setPrevDealerTotalScore(0);
                setStake(min);
                setIsStand(false);
                setIsEnd(false);
                setIsDraw(false);
                setIsBlackjack(false);
                setWinner(null);
                setIsDisabled(false);
                setIsAnimating(false);
                setCurrentAction('bet');
              },
              null,
              '-=0.75',
            );

          break;

        default:
          break;
      }
    }

    // eslint-disable-next-line
  }, [currentAction, isLoading]);

  // check if someone won
  useEffect(() => {
    let whoWin = null;
    if (isGame) {
      switch (true) {
        case playerScore > 21:
        case dealerScore === 21:
        case dealerTotalScore === 21:
          whoWin = 'dealer';
          break;
        case dealerScore > 21:
          whoWin = 'player';
          break;
        case playerScore === 21 && dealerScore < 21:
        case playerScore === 21 && dealerTotalScore < 21:
        case playerTotalScore === 21 && dealerScore < 21:
        case playerTotalScore === 21 && dealerTotalScore < 21:
          whoWin = 'player';
          setIsBlackjack(true);
          break;

        default:
          break;
      }

      if (isStand && isEnd) {
        switch (true) {
          case playerScore > dealerScore && playerScore < 21 && !isAceDealer:
          case playerScore > dealerTotalScore && playerScore < 21:
          case playerTotalScore > dealerScore && playerTotalScore < 21 && !isAceDealer:
          case playerTotalScore > dealerTotalScore && playerTotalScore < 21:
            whoWin = 'player';
            break;
          case dealerScore > playerScore && dealerScore < 21 && !isAcePlayer:
          case dealerScore > playerTotalScore && dealerScore < 21:
          case dealerTotalScore > playerScore && dealerTotalScore < 21 && !isAcePlayer:
          case dealerTotalScore > playerTotalScore && dealerTotalScore < 21:
            whoWin = 'dealer';
            break;
          case playerScore === dealerScore && playerTotalScore < 21 && dealerTotalScore < 21:
          case playerTotalScore === dealerTotalScore &&
            playerTotalScore < 21 &&
            dealerTotalScore < 21:
          case dealerTotalScore === playerScore && dealerTotalScore < 21 && playerScore < 21:
          case playerTotalScore === dealerScore && playerTotalScore < 21 && dealerScore < 21:
            whoWin = null;
            setTimeout(() => {
              setIsDraw(true);
            }, 500);
            break;

          default:
            break;
        }
      }

      setTimeout(() => {
        setWinner(whoWin);
      }, 500);
    }

    setTimeout(() => {
      setPrevPlayerScore(playerScore);
      setPrevPlayerTotalScore(playerTotalScore);
      setPrevDealerScore(dealerScore);
      setPrevDealerTotalScore(dealerTotalScore);
    }, 1000);
  }, [
    playerScore,
    playerTotalScore,
    dealerScore,
    dealerTotalScore,
    isStand,
    isEnd,
    isAceDealer,
    isAcePlayer,
    isGame,
  ]);

  // animate player cards
  useEffect(() => {
    if (playerHand.length && isGame) {
      const deckPos = {
        x: window.innerWidth * 0.96 - 144,
        y: window.innerHeight * 0.1,
      };

      const handPos = {
        x: window.innerWidth / 2 + 55 * (playerHand.length - 1) - 144,
        y: window.innerHeight - 432,
      };

      gsap.defaults({ ease: 'power2.inOut', duration: 1.25 });
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
          0,
        )
        .call(
          () => {
            const newArray = isFlippedPlayer;
            newArray[playerHand.length - 1] = false;
            setIsFlippedPlayer(newArray);
          },
          null,
          0.25,
        );
    }

    // eslint-disable-next-line
  }, [playerHand]);

  // animate dealer cards
  useEffect(() => {
    if (dealerHand.length && isGame) {
      const deckPos = {
        x: window.innerWidth * 0.96 - 144,
        y: window.innerHeight * 0.1,
      };

      const handPos = {
        x: window.innerWidth / 2 + 55 * (dealerHand.length - 1) - 144,
        y: 34,
      };

      gsap.defaults({ ease: 'power2.inOut', duration: 1.25 });
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
          0,
        )
        .call(
          () => {
            const newArray = isFlippedDealer;
            newArray[dealerHand.length - 1] = dealerHand.length === 2;
            setIsFlippedDealer(newArray);
          },
          null,
          0.25,
        );
    }

    // eslint-disable-next-line
  }, [dealerHand]);

  // count player score
  useEffect(() => {
    let score = 0;
    let totalScore = 0;
    let aces = 0;

    playerHand.forEach(({ value }) => {
      if (value === 'A') {
        score += 1;
        totalScore += 11;
        aces += 1;
      } else if (typeof value === 'string') {
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
  }, [isFlippedPlayer, playerHand]);

  // count dealer score
  useEffect(() => {
    let score = 0;
    let totalScore = 0;
    let aces = 0;

    dealerHand.forEach(({ value }, i) => {
      if (i !== 1 || isStand) {
        if (value === 'A') {
          score += 1;
          totalScore += 11;
          aces += 1;
        } else if (typeof value === 'string') {
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
      setIsAnimating(false);
    }, 1000);
  }, [dealerHand, isFlippedDealer, isStand]);

  // stand mechanism
  useEffect(() => {
    if (isStand) {
      if (
        (dealerScore <= 16 && !isAnimating) ||
        (dealerTotalScore <= 16 && dealerTotalScore <= 21 && !isAnimating)
      ) {
        setIsAnimating(true);
        handleDeal('dealer', true);
      }

      if (dealerScore >= 17 || (dealerTotalScore >= 17 && dealerTotalScore <= 21)) {
        setIsEnd(true);
      }
    }

    // eslint-disable-next-line
  }, [dealerScore, dealerTotalScore, isStand, isAnimating]);

  useEffect(() => {
    if (isGame) {
      if (winner || isDraw) {
        if (isStand) {
          setCurrentAction('win');
        } else {
          setIsFlippedDealer([false, false]);
          setTimeout(() => {
            setCurrentAction('win');
          }, 1000);
        }
      }
    }
  }, [winner, isDraw, isStand, isGame]);

  const handleDeal = (destination, isFlipped = false) => {
    if (isGame) {
      setIsDisabled(true);
      const card = deal(deck);

      if (destination === 'player') {
        setIsFlippedPlayer((prevFlipped) => [...prevFlipped, true]);
        setPlayerHand((prevHand) => [...prevHand, card]);
      } else {
        setIsFlippedDealer((prevFlipped) => [...prevFlipped, isFlipped]);
        setDealerHand((prevHand) => [...prevHand, card]);
      }

      setTimeout(() => {
        setIsDisabled(false);
      }, 1250);
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

    setCurrentAction('decision');
  };

  const handleStand = () => {
    setCurrentAction('stand');
  };

  const handleDoubleDown = () => {
    setIsDisabled(true);
    setBalance(balance - stake);
    setStake(stake * 2);
    handleDeal('player');

    setTimeout(() => {
      handleStand();
    }, 1251);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Wrapper>
      {isBankrupt && <Modal />}
      {(winner || isDraw) && <Winner winner={winner} isBlackjack={isBlackjack} isDraw={isDraw} />}
      <Chat logs={logs} />
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
        <Score isWin={winner === 'player'} isLose={winner === 'dealer'} isDraw={isDraw} player>
          <CountUp start={prevPlayerScore} end={playerScore} duration={1} delay={0} />
          {isAcePlayer ? (
            <>
              {' '}
              /{' '}
              <CountUp start={prevPlayerTotalScore} end={playerTotalScore} duration={1} delay={0} />
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
        <Score isWin={winner === 'dealer'} isLose={winner === 'player'} isDraw={isDraw}>
          <CountUp start={prevDealerScore} end={dealerScore} duration={1} delay={0} />
          {isAceDealer ? (
            <>
              {' '}
              /{' '}
              <CountUp start={prevDealerTotalScore} end={dealerTotalScore} duration={1} delay={0} />
            </>
          ) : null}
        </Score>
      )}
      <Controls ref={betControlsRef}>
        <Button type="button" onClick={() => handleBet(min)} disabled={isDisabled}>
          Min. ${min}
        </Button>

        <Button
          type="button"
          onClick={() => handleBet(isAllIn ? balance : max)}
          disabled={isDisabled}
        >
          {isAllIn ? 'All in' : `Max. $${max}`}
        </Button>

        <SliderContainer>
          <Row>
            <Button type="button" margin onClick={() => handleBet(stake)} disabled={isDisabled}>
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
            <Value ref={stakeRef}>${stake}</Value>
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
        <Button type="button" onClick={() => handleDeal('player')} disabled={isDisabled}>
          HIT
        </Button>

        <Button type="button" onClick={handleStand} disabled={isDisabled}>
          STAND
        </Button>

        <Button type="button" onClick={handleDoubleDown} disabled={isDisabled || !canDoubleDown}>
          DOUBLE {canDoubleDown && `$${stake}`}
        </Button>
      </Controls>
    </Wrapper>
  );
}

Game.propTypes = {
  userId: PropTypes.string,
};

Game.defaultProps = {
  userId: null,
};

export default Game;
