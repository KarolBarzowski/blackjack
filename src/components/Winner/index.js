import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';

const Appear = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
`;

const Disappear = keyframes`
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
`;

const SlideInOut = keyframes`
    0% {
        transform: translateX(-100vw);
    }

    25% {
        transform: translateX(0);
    }

    75% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(100vw);
    }
`;

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  background-color: ${({ isWin }) => (isWin ? 'rgba(48, 209, 88, .6)' : 'rgba(255, 69, 58, .6)')};
  height: 14.4rem;
  width: 100%;
  transform: translateY(-50%);
  opacity: 0;
  z-index: 3;
  animation: ${Appear} 0.3s ease-in-out 0.3s forwards, ${Disappear} 0.3s ease-in-out 2.8s forwards;
  overflow: hidden;

  ${({ isDraw }) =>
    isDraw &&
    css`
      background-color: rgba(0, 0, 0, 0.6);
    `}
`;

const Text = styled.h1`
  font-size: 3.4rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  text-shadow: #000000 0 0 7px;
  animation: ${SlideInOut} 3s ease-in-out forwards;
`;

const Winner = ({ winner, isBlackjack, isDraw }) => (
  <Wrapper isWin={winner === 'player'} isDraw={isDraw}>
    <Text>
      {winner === 'player'
        ? isBlackjack
          ? isDraw
            ? 'Draw!'
            : 'BLACKJACK! You won!'
          : 'You won!'
        : isDraw
        ? 'Draw!'
        : 'You lost!'}
    </Text>
  </Wrapper>
);

Winner.propTypes = {
  winner: PropTypes.string,
  isBlackjack: PropTypes.bool,
  isDraw: PropTypes.bool,
};

Winner.defaultProps = {
  winner: null,
  isBlackjack: false,
  isDraw: false,
};

export default Winner;
