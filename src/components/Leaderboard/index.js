import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { getAvatar, getLabel } from 'helpers/functions';
import { database } from 'helpers/firebase';
import Paragraph from 'components/Paragraph';

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const Topbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  width: 100%;
`;

const StyledParagraph = styled(Paragraph)`
  font-size: 1.6rem;
  font-weight: 400;
  color: ${({ theme }) => theme.textSecondary};
`;

const List = styled.ul`
  list-style-type: none;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 6.4rem;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 0.5rem;
  margin: 1rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  ${Paragraph} {
    width: 30%;
    text-align: center;
  }
`;

const Nickname = styled(Paragraph)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  ${({ isUser }) =>
    isUser &&
    css`
      color: ${({ theme }) => theme.blue};
    `}

  svg {
    height: 4.8rem;
    width: 4.8rem;
    margin-right: 1rem;
  }
`;

const Gray = styled.span`
  color: ${({ theme }) => theme.textSecondary};
`;

const Balance = styled.span`
  color: ${({ theme, isRed }) => (isRed ? theme.red : theme.textSecondary)};
`;

function Leaderboard({ userId }) {
  const [list, setList] = useState(null);

  useEffect(() => {
    const listOfUsers = [];

    const usersRef = database.ref('users');

    usersRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const { balance, debt, avatarId, nickname } = childSnapshot.val();

        const userObject = {
          nickname,
          avatarId,
          balance: parseFloat(balance) - parseFloat(debt),
          id: childSnapshot.key,
        };

        listOfUsers.push(userObject);
      });
      listOfUsers.sort((a, b) => b.balance - a.balance);
      setList(listOfUsers);
    });
  }, []);

  return (
    <Wrapper>
      <Topbar>
        <StyledParagraph>Number</StyledParagraph>
        <StyledParagraph>Nickname</StyledParagraph>
        <StyledParagraph>Balance with debt</StyledParagraph>
      </Topbar>
      <List>
        {list &&
          list.map(({ nickname, balance, id, avatarId }, i) => (
            <Item key={i.toString()}>
              <Paragraph>{1 + i}</Paragraph>
              <Nickname isUser={id === userId}>
                {getAvatar(avatarId)} {nickname}
              </Nickname>
              <Paragraph>
                <Gray>$</Gray>
                <Balance isRed={balance < 0}>{getLabel(balance)}</Balance>
              </Paragraph>
            </Item>
          ))}
      </List>
    </Wrapper>
  );
}

Leaderboard.propTypes = {
  userId: PropTypes.string,
};

Leaderboard.defaultProps = {
  userId: null,
};

export default Leaderboard;
