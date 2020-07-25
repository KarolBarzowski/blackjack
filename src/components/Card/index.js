import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import ReactCardFlip from 'react-card-flip';
import Reverse from 'components/Reverse';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  user-select: none;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-between;
  height: 23.3rem;
  width: 14.4rem;
  padding: 0 0.5rem;
  background-color: #ffffff;
  box-shadow: 0.3rem -0.3rem 5px rgba(0, 0, 0, 0.16), 0.3rem -0.3rem 5px rgba(0, 0, 0, 0.23),
    -0.3rem 0.3rem 5px rgba(0, 0, 0, 0.23);
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

const CardValue = styled.p`
  font-family: 'Montserrat', sans-serif;
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

function Card({ isFlipped, value, suit, color }) {
  return (
    <Container>
      <ReactCardFlip isFlipped={isFlipped}>
        {!isFlipped ? (
          <Wrapper>
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
          </Wrapper>
        ) : null}

        <Wrapper>
          <Reverse />
        </Wrapper>
      </ReactCardFlip>
    </Container>
  );
}

Card.propTypes = {
  isFlipped: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  suit: PropTypes.string,
  color: PropTypes.string,
};

Card.defaultProps = {
  isFlipped: false,
  value: null,
  suit: null,
  color: null,
};

export default Card;
