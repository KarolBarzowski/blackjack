import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";
import Heading from "components/Heading";
import Paragraph from "components/Paragraph";
import { stakesLabels, stakes } from "helpers/data";
import { auth, database } from "helpers/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";

const StyledHeading = styled(Heading)`
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  width: 100%;
`;

const Label = styled.label`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
`;

const Input = styled.input`
  background-color: transparent;
  padding: 1rem;
  color: rgb(255, 255, 255, 0.87);
  font-family: "Montserrat", sans-serif;
  font-size: 2.1rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: 1px solid rgb(99, 99, 102);
  width: 32rem;
  outline: none;

  ::placeholder {
    color: rgb(99, 99, 102);
  }
`;

const StyledParagraph = styled(Paragraph)`
  font-size: 1.6rem;
  margin: 1.5rem 0 0.5rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const Counter = styled(StyledParagraph)`
  font-size: 1.3rem;
  position: absolute;
  left: 32.5rem;
  bottom: 0;
  margin: 0;
  transition: color 0.15s ease-in-out;

  ${({ full }) =>
    full &&
    css`
      color: ${({ theme }) => theme.red};
    `}
`;

const Row = styled.div`
  flex-flow: row nowrap;
  overflow: hidden;
`;

const Button = styled.button`
  height: 4.8rem;
  padding: 1rem;
  min-width: 16rem;
  border: none;
  background-color: transparent;
  font-size: 1.6rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  font-family: "Montserrat", sans-serif;
  background-color: rgba(0, 132, 255, 0.34);
  cursor: pointer;
  outline: none;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;

  :first-of-type {
    border-radius: 1rem 0 0 1rem;
  }

  :last-of-type {
    border-radius: 0 1rem 1rem 0;
  }

  :hover {
    color: ${({ theme }) => theme.text};
  }

  :disabled {
    opacity: 0.38;
    cursor: default;
  }

  ${({ active }) =>
    active &&
    css`
      background-color: ${({ theme }) => theme.blue};
      color: ${({ theme }) => theme.text};
    `};

  ${({ submit }) =>
    submit &&
    css`
      border-radius: 1rem !important;
      background-color: ${({ theme }) => theme.green};
      color: ${({ theme }) => theme.text};
      font-size: 2.1rem;
      width: 13rem;
      margin-top: 5.5rem;
    `};
`;

function CreateForm({ setActive, nickname }) {
  const [name, setName] = useState(`${nickname}'s table`);
  const [defaultName, setDefaultName] = useState(`${nickname}'s table`);
  const [isOpen, setIsOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [stake, setStake] = useState(0);
  const [password, setPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const history = useHistory();

  const handleNameChange = (e) => {
    if (e.target.value.length <= 30) {
      setName(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    setIsCreating(true);
    e.preventDefault();

    const userId = auth.currentUser.uid;

    const gamesRef = database.ref("/games");
    const userRef = database.ref(`/users/${userId}`);

    const newGame = gamesRef.push();
    newGame.set({
      id: newGame.key,
      name,
      min: stakes[stake][0],
      max: stakes[stake][1],
      isPrivate,
      password,
      owner: userId,
    });

    userRef.update(
      {
        hasTable: 1,
      },
      (error) => {
        if (!error) {
          setIsCreating(false);
          database.ref(`/users/${userId}`).update({
            currentTable: newGame.key,
          });
        }
      }
    );
  };

  return (
    <Form onSubmit={handleSubmit}>
      <StyledHeading>Create your own table</StyledHeading>
      <Label>
        <StyledParagraph>Table name</StyledParagraph>
        <Input
          type="text"
          placeholder={defaultName}
          value={name}
          onChange={(e) => handleNameChange(e)}
        />
        <Counter as="span" full={name.length >= 30}>
          {name.length}/30
        </Counter>
      </Label>
      <StyledParagraph>Stakes</StyledParagraph>
      <Row>
        {stakesLabels.map((text, i) => (
          <Button
            type="button"
            active={stake === i}
            onClick={() => setStake(i)}
          >
            {text}
          </Button>
        ))}
      </Row>
      <StyledParagraph>Type</StyledParagraph>
      <Row>
        <Button
          type="button"
          active={!isPrivate}
          onClick={() => setIsPrivate(false)}
        >
          <FontAwesomeIcon icon={faLockOpen} transform="left-10" />
          Public
        </Button>
        <Button
          type="button"
          active={isPrivate}
          onClick={() => setIsPrivate(true)}
        >
          <FontAwesomeIcon icon={faLock} transform="left-10" />
          Private
        </Button>
      </Row>
      {isPrivate && (
        <Label>
          <StyledParagraph>Password</StyledParagraph>
          <Input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Label>
      )}
      <Button
        type="submit"
        submit
        disabled={!name.length || (isPrivate && !password.length) || isCreating}
      >
        <FontAwesomeIcon icon={faPlus} transform="left-10" />
        Create
      </Button>
    </Form>
  );
}

export default CreateForm;
