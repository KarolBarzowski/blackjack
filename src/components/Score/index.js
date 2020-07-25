import styled, { css, keyframes } from 'styled-components';

const Appear = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 1
    }
`;

const Score = styled.p`
  position: absolute;
  font-family: 'Montserrat', sans-serif;
  font-size: 2.1rem;
  font-weight: 500;
  min-width: 5.5rem;
  margin: 1rem 0.5rem 0;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.21);
  border-radius: 0.5rem;
  padding: 0.3rem 0.6rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  opacity: ${({ isHidden }) => (isHidden ? 0 : 1)} !important;
  transition: background-color 0.15s ease-in-out, opacity 0.15s ease-in-out;
  animation: ${Appear} 0.15s ease-in-out forwards;

  ::before {
    content: '';
    position: absolute;
    top: -0.8rem;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 0.65rem solid transparent;
    border-right: 0.65rem solid transparent;
    border-bottom: 0.8rem solid rgba(0, 0, 0, 0.21);
    transition: border-bottom-color 0.15s ease-in-out;
  }

  ${({ player }) =>
    player
      ? css`
          bottom: 14rem;
        `
      : css`
          top: 28rem;
        `}

  ${({ isStand }) =>
    isStand &&
    css`
      background-color: ${({ theme }) => theme.orange};

      ::before {
        border-bottom-color: ${({ theme }) => theme.orange};
      }
    `};

  ${({ isWin }) =>
    isWin &&
    css`
      background-color: ${({ theme }) => theme.green};

      ::before {
        border-bottom-color: ${({ theme }) => theme.green};
      }
    `};

  ${({ isLose }) =>
    isLose &&
    css`
      background-color: ${({ theme }) => theme.red};

      ::before {
        border-bottom-color: ${({ theme }) => theme.red};
      }
    `};

  ${({ isDraw }) =>
    isDraw &&
    css`
      background-color: rgba(0, 0, 0, 0.21);

      ::before {
        border-bottom-color: rgba(0, 0, 0, 0.21);
      }
    `};
`;

export default Score;
