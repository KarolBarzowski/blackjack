import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { loans } from 'helpers/data';
import { getLabel } from 'helpers/functions';
import { database } from 'helpers/firebase';
import Heading from 'components/Heading';
import Paragraph from 'components/Paragraph';
import Button from 'components/Button';

const Input = styled.input`
  background-color: transparent;
  padding: 1rem;
  color: rgb(255, 255, 255, 0.87);
  font-family: 'Montserrat', sans-serif;
  font-size: 2.1rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: 1px solid rgb(99, 99, 102);
  min-width: 21rem;
  outline: none;

  ::placeholder {
    color: rgb(99, 99, 102);
  }
`;

const StyledParagraph = styled(Paragraph)`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-top: 1rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;

const Tile = styled.button`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 1rem;
  width: 20%;
  height: 14.4rem;
  margin: 0 1rem;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  cursor: pointer;
  outline: none;

  :hover:not(:disabled),
  :focus {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  :disabled {
    opacity: 0.38;
    cursor: default;
    box-shadow: none;
  }

  ${({ highlight }) =>
    highlight &&
    css`
      :disabled {
        opacity: 1;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
      }
    `}
`;

const Confirm = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-left: 1.5rem;
`;

const TextButton = styled(StyledParagraph)`
  border: none;
  background-color: transparent;
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`;

const Error = styled(Paragraph)`
  color: ${({ theme }) => theme.red};
`;

const StyledHeading = styled(Heading)`
  margin: 0;
`;

function Bank({ userId }) {
  const [debt, setDebt] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [value, setValue] = useState(0);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    database.ref(`/users/${userId}/debt`).on('value', (snapshot) => setDebt(snapshot.val() || 0));

    database
      .ref(`/users/${userId}/balance`)
      .on('value', (snapshot) => setBalance(snapshot.val() || 0));

    return () => {
      database
        .ref(`/users/${userId}/debt`)
        .off('value', (snapshot) => setDebt(snapshot.val() || 0));

      database
        .ref(`/users/${userId}/balance`)
        .off('value', (snapshot) => setBalance(snapshot.val() || 0));
    };
  }, [userId]);

  const handleConfirm = (id) => {
    setIsConfirm(true);
    setCurrentId(id);
  };

  const handleCancel = () => {
    setIsConfirm(false);
    setCurrentId(null);
  };

  const handleTakeLoan = () => {
    setIsConfirm(false);
    database.ref(`/users/${userId}`).update(
      {
        debt: debt + loans[currentId].payoff,
        balance: balance + loans[currentId].take,
      },
      () => {
        handleCancel();
      },
    );
  };

  const handlePay = () => {
    if (value <= 0) {
      setIsError(true);
      setErrorMsg('Amount must be greater than 0!');
    } else if (value > debt) {
      setIsError(true);
      setErrorMsg("Amount can't be greater than your debt!");
    } else if (value > balance) {
      setIsError(true);
      setErrorMsg("Amount can't be greater than your balance!");
    } else {
      setIsError(false);
      database.ref(`/users/${userId}`).update({
        balance: balance - parseFloat(value),
        debt: debt - parseFloat(value),
      });
    }
  };

  return (
    <Wrapper>
      <StyledHeading>Bank</StyledHeading>
      <div>
        <Paragraph>{debt ? `Your debt: $${debt}` : `Currently you have no debt. 😎`}</Paragraph>
        {debt ? (
          <Row>
            <Input
              type="number"
              placeholder="Amount"
              min={1}
              max={parseFloat(debt)}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button type="button" onClick={handlePay}>
              Pay
            </Button>
            {isError && <Error>{errorMsg}</Error>}
          </Row>
        ) : null}
      </div>
      <div>
        <Row>
          <StyledHeading>Available loans</StyledHeading>
          {isConfirm && (
            <Confirm>
              <Paragraph>You sure?</Paragraph>
              <Button type="button" onClick={handleTakeLoan}>
                Confirm
              </Button>
              <TextButton as="button" type="button" onClick={handleCancel}>
                Cancel
              </TextButton>
            </Confirm>
          )}
        </Row>
        <Row>
          {loans.map(({ take, payoff }, i) => (
            <Tile
              key={i.toString()}
              type="button"
              onClick={() => handleConfirm(i)}
              highlight={currentId === i}
              disabled={isConfirm}
            >
              <StyledParagraph>Take:</StyledParagraph>
              <Paragraph>${getLabel(take)}</Paragraph>
              <br />
              <StyledParagraph>Payoff:</StyledParagraph>
              <Paragraph>${getLabel(payoff)}</Paragraph>
            </Tile>
          ))}
        </Row>
      </div>
    </Wrapper>
  );
}

Bank.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default Bank;
