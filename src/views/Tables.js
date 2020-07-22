import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { Redirect, Link, withRouter, useHistory } from "react-router-dom";
import queryString from "query-string";
import { database } from "helpers/firebase";
import { Appear } from "helpers/animations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faLock,
  faLockOpen,
  faCertificate,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "components/Sidebar";
import Paragraph from "components/Paragraph";
import Heading from "components/Heading";
import CreateForm from "components/CreateForm";

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
    0 4px 4px rgba(0, 0, 0, 0.12), 0 8px 8px rgba(0, 0, 0, 0.12),
    0 16px 16px rgba(0, 0, 0, 0.12);
  animation: ${Appear} 0.3s ease-in-out forwards;
`;

const Content = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 1.5rem 1rem;
`;

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  height: 6.4rem;
  width: 100%;
  padding: 1.5rem;
  margin: 0 0 1.5rem;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 1rem;
  box-shadow: -0.3rem 0.3rem 5px rgba(0, 0, 0, 0.23);
`;

const StyledParagraph = styled(Paragraph)`
  width: 25%;
  text-align: center;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 2.4rem;
`;

const Button = styled.button`
  height: 3.6rem;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.green};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  cursor: pointer;
  transition: background-color 0.05s ease-in-out, opacity 0.15s ease-in-out;
  outline: none;

  :hover:not(:disabled) {
    background-color: #12a537;
  }

  :disabled {
    opacity: 0.38;
    box-shadow: none;
    cursor: default;
  }

  ${({ orange }) =>
    orange &&
    css`
      background-color: ${({ theme }) => theme.orange};

      :hover:not(:disabled) {
        background-color: #dd7d08;
      }
    `};

  ${({ remove }) =>
    remove &&
    css`
      background-color: ${({ theme }) => theme.red};
      margin-right: 1.5rem;

      :hover:not(:disabled) {
        background-color: #ee3429;
      }
    `};
`;

const Center = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
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
  margin: 1.5rem 0;

  ::placeholder {
    color: rgb(99, 99, 102);
  }
`;

const Error = styled(Paragraph)`
  color: ${({ theme }) => theme.red};
  margin: 0 0 1.5rem 0;
`;

const Tile = styled(Link)`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  align-self: center;
  height: 80%;
  width: 80%;
  padding: 3rem;
  text-decoration: none;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 3rem;
  transition: transform 0.15s ease-in-out;

  :hover {
    transform: scale(1.05);
  }
`;

function Tables({ userId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState(null);
  const [balance, setBalance] = useState(null);
  const [avatarId, setAvatarId] = useState(null);
  const [hasTable, setHasTable] = useState(0);
  const [active, setActive] = useState("play");
  const [allTables, setAllTables] = useState([]);
  const [publicTables, setPublicTables] = useState([]);
  const [officialTables, setOfficialTables] = useState([]);
  const [privateTables, setPrivateTables] = useState([]);
  const [joiningTable, setJoiningTable] = useState(null);
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (userId) {
      database
        .ref(`/users/${userId}`)
        .once("value")
        .then((snapshot) => {
          const { nickname, balance, avatarId } = snapshot.val();

          setNickname(nickname);
          setBalance(balance);
          setAvatarId(avatarId);
          setIsLoading(false);
        });
    }
  }, [setIsLoading, userId]);

  useEffect(() => {
    const { active } = queryString.parse(history.location.search);
    if (active) {
      setActive(active);
    }
  }, [history]);

  return (
    <Container>
      {isLoading ? (
        <FontAwesomeIcon icon={faSpinner} size="4x" spin />
      ) : (
        <Wrapper>
          <Sidebar
            nickname={nickname}
            balance={balance}
            avatarId={avatarId}
            active={active}
            setActive={setActive}
          />
          <Content>
            {active === "play" && (
              <Tile to="play">
                <Paragraph>Play</Paragraph>
              </Tile>
            )}
            {active === "bank" && (
              <Tile>
                <Paragraph>Bank</Paragraph>
              </Tile>
            )}
          </Content>
        </Wrapper>
      )}
    </Container>
  );
}

export default Tables;
