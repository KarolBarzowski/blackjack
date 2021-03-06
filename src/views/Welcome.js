import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Heading from 'components/Heading';
import Paragraph from 'components/Paragraph';

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 7.9rem 1.5rem 1.5rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  overflow: hidden;
`;

const Tile = styled(Link)`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  height: 45%;
  width: 70%;
  text-decoration: none;
  background-color: ${({ theme }) => theme.dark};
  border-radius: 3rem;
  transition: transform 0.15s ease-in-out;

  :hover {
    transform: scale(1.05);
  }

  @media screen and (min-width: 800px) {
    width: 45%;
    height: 70%;
  }
`;

const Row = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 80vh;
`;

const Welcome = () => (
  <Wrapper>
    <Heading>Choose game mode</Heading>
    <Row>
      <Tile to="play">
        <Paragraph>Play alone</Paragraph>
      </Tile>
      <Tile to="tables">
        <Paragraph>Play with other players</Paragraph>
      </Tile>
    </Row>
  </Wrapper>
);

export default Welcome;
