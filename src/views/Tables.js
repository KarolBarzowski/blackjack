import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { database } from 'helpers/firebase';
import { Appear } from 'helpers/animations';
import { getLabel } from 'helpers/functions';
import { stakes } from 'helpers/data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Sidebar from 'components/Sidebar';
import Paragraph from 'components/Paragraph';
import Bank from 'components/Bank';
import Button from 'components/Button';
import Leaderboard from 'components/Leaderboard';
import Header from 'components/Header';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  padding: 10rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.dark};
  border-radius: 1.5rem;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.12),
    0 4px 4px rgba(0, 0, 0, 0.12), 0 8px 8px rgba(0, 0, 0, 0.12), 0 16px 16px rgba(0, 0, 0, 0.12);
  animation: ${Appear} 0.3s ease-in-out forwards;
`;

const Content = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  padding: 1.5rem 1rem;
`;

const Tile = styled.button`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-around;
  align-self: center;
  height: 45%;
  width: 30%;
  padding: 3rem;
  text-decoration: none;
  background-color: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 3rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: transform 0.15s ease-in-out;
  cursor: pointer;

  :hover:not(:disabled),
  :focus {
    transform: scale(1.05);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  :disabled {
    opacity: 0.38;
    cursor: default;
    box-shadow: none;
  }
`;

const StyledParagraph = styled(Paragraph)`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.textSecondary};
`;

function Tables({ userId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState(null);
  const [balance, setBalance] = useState(null);
  const [avatarId, setAvatarId] = useState(null);
  const [active, setActive] = useState('play');
  const history = useHistory();

  useEffect(() => {
    if (userId) {
      database
        .ref(`/users/${userId}`)
        .once('value')
        .then((snapshot) => {
          const { nickname, avatarId } = snapshot.val();

          setNickname(nickname);
          setAvatarId(avatarId);
          setIsLoading(false);
        });

      database
        .ref(`/users/${userId}/balance`)
        .on('value', (snapshot) => setBalance(snapshot.val()));
    }

    return () => {
      database
        .ref(`/users/${userId}/balance`)
        .off('value', (snapshot) => setBalance(snapshot.val()));
    };
  }, [setIsLoading, userId]);

  useEffect(() => {
    const { active } = queryString.parse(history.location.search);
    if (active) {
      setActive(active);
    }
  }, [history]);

  const handlePlay = (id) => {
    window.localStorage.setItem('min', stakes[id][0]);
    window.localStorage.setItem('max', stakes[id][1]);

    history.push('/play');
  };

  return (
    <Container>
      {isLoading ? (
        <FontAwesomeIcon icon={faSpinner} size="4x" spin />
      ) : (
        <>
          <Header />
          <Wrapper>
            <Sidebar
              nickname={nickname}
              balance={balance}
              avatarId={avatarId}
              active={active}
              setActive={setActive}
            />
            <Content>
              {active === 'play' &&
                stakes.map((stake, i) => (
                  <Tile
                    type="button"
                    onClick={() => handlePlay(i)}
                    disabled={balance < stake[0]}
                    key={i.toString()}
                  >
                    <div>
                      <StyledParagraph>Stakes</StyledParagraph>
                      <Paragraph>
                        ${getLabel(stake[0])} - ${getLabel(stake[1])}
                      </Paragraph>
                    </div>
                    <Button as={Paragraph}>Play</Button>
                  </Tile>
                ))}
              {active === 'bank' && <Bank userId={userId} />}
              {active === 'leaderboard' && <Leaderboard userId={userId} />}
            </Content>
          </Wrapper>
        </>
      )}
    </Container>
  );
}

Tables.propTypes = {
  userId: PropTypes.string,
};

Tables.defaultProps = {
  userId: null,
};

export default Tables;
