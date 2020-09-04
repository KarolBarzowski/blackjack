import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { database } from 'helpers/firebase';
import CountUp from 'react-countup';
import Heading from 'components/Heading';

const Wrapper = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
`;

function Header() {
  const [count, setCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    const ref = database.ref('casinoBalance');
    ref.on('value', (snapshot) => {
      setCount(snapshot.val());
      setTimeout(() => {
        setPrevCount(snapshot.val());
      }, 750);
    });
  }, []);

  return (
    <Wrapper>
      <Heading>
        Casino {count < 0 ? 'loss' : 'profit'}: $
        <CountUp start={prevCount} end={count} duration={0.75} delay={0.1} />
      </Heading>
    </Wrapper>
  );
}

export default Header;
