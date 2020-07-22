import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { Redirect, Link } from "react-router-dom";
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
  const [active, setActive] = useState("all tables");
  const [allTables, setAllTables] = useState([]);
  const [publicTables, setPublicTables] = useState([]);
  const [officialTables, setOfficialTables] = useState([]);
  const [privateTables, setPrivateTables] = useState([]);
  const [joiningTable, setJoiningTable] = useState(null);
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);

  useEffect(() => {
    const gamesRef = database.ref("/games");

    if (userId) {
      database
        .ref(`/users/${userId}`)
        .once("value")
        .then((snapshot) => {
          const { nickname, balance, avatarId } = snapshot.val();

          setNickname(nickname);
          setBalance(balance);
          setAvatarId(avatarId);
          // setHasTable(hasTable);
          setIsLoading(false);
        });

      // handleUpdateLists();

      // gamesRef.on("child_added", handleUpdateLists);
      // gamesRef.on("child_changed", handleUpdateLists);
      // gamesRef.on("child_removed", handleUpdateLists);
    }

    // return () => {
    //   gamesRef.off("child_added", handleUpdateLists);
    //   gamesRef.off("child_changed", handleUpdateLists);
    //   gamesRef.off("child_removed", handleUpdateLists);
    // };
    // eslint-disable-next-line
  }, [setIsLoading, userId]);

  // const handleUpdateLists = () => {
  //   const newAllTables = [];
  //   const newOfficialTables = [];
  //   const newPublicTables = [];
  //   const newPrivateTables = [];
  //   let ownTables = 0;

  //   var gamesRef = database.ref("/games");

  //   gamesRef.once("value", (snapshot) => {
  //     snapshot.forEach((childSnapshot) => {
  //       newAllTables.push(childSnapshot.val());
  //       if (childSnapshot.val().owner === userId) ownTables += 1;

  //       if (childSnapshot.val().isPrivate)
  //         newPrivateTables.push(childSnapshot.val());
  //       else if (childSnapshot.val().owner !== "official")
  //         newPublicTables.push(childSnapshot.val());

  //       if (childSnapshot.val().owner === "official")
  //         newOfficialTables.push(childSnapshot.val());
  //     });

  //     setAllTables(newAllTables);
  //     setOfficialTables(newOfficialTables);
  //     setPublicTables(newPublicTables);
  //     setPrivateTables(newPrivateTables);
  //     setHasTable(ownTables);
  //   });
  // };

  // const handleJoin = (table) => {
  //   setJoiningTable(table);
  //   if (table.isPrivate) {
  //     setActive("join");
  //   } else {
  //     database.ref(`/users/${userId}`).update({
  //       currentTable: table.id,
  //     });
  //     setIsRedirect(true);
  //   }
  // };

  // const handleEnterPassword = () => {
  //   if (password === joiningTable.password) {
  //     database.ref(`/users/${userId}`).update({
  //       currentTable: joiningTable.id,
  //     });
  //     setIsRedirect(true);
  //   } else {
  //     setIsError(true);
  //   }
  // };

  // const handleDelete = (table) => {
  //   database.ref(`/games/${table.id}`).remove();
  // };

  // if (isRedirect) return <Redirect to={`/tables/${joiningTable.id}`} />;

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
            // active={active}
            // setActive={setActive}
            // allTablesLength={allTables.length}
            // publicTablesLength={publicTables.length}
            // officialTablesLength={officialTables.length}
            // privateTablesLength={privateTables.length}
            // hasTable={hasTable}
          />
          <Content>
            <Tile to="play">
              <Paragraph>Play</Paragraph>
            </Tile>
            {/* <>
              {active === "all tables" && (
                <List>
                  {allTables.map(
                    (
                      { id, isPrivate, name, min, max, players = {}, owner },
                      i
                    ) => (
                      <ListItem key={i.toString()}>
                        <Icon
                          icon={
                            owner === "official"
                              ? faCertificate
                              : isPrivate
                              ? faLock
                              : faLockOpen
                          }
                          color={
                            owner === "official"
                              ? "rgb(0, 132, 255)"
                              : isPrivate
                              ? "rgb(255, 159, 10)"
                              : "rgb(52, 199, 89)"
                          }
                        />
                        <StyledParagraph>{name}</StyledParagraph>
                        <StyledParagraph>
                          ${min} - ${max}
                        </StyledParagraph>
                        <StyledParagraph>
                          {Object.keys(players).length}/3
                        </StyledParagraph>
                        <Button
                          type="button"
                          orange={isPrivate}
                          disabled={
                            balance < min || Object.keys(players).length >= 3
                          }
                          onClick={() => handleJoin(allTables[i])}
                        >
                          <Paragraph>Join</Paragraph>
                        </Button>
                      </ListItem>
                    )
                  )}
                </List>
              )}
              {active === "your tables" && (
                <List>
                  {allTables.map(
                    (
                      { id, isPrivate, name, min, max, players = {}, owner },
                      i
                    ) =>
                      owner === userId && (
                        <ListItem key={i.toString()}>
                          <Icon
                            icon={isPrivate ? faLock : faLockOpen}
                            color={
                              isPrivate
                                ? "rgb(255, 159, 10)"
                                : "rgb(52, 199, 89)"
                            }
                          />
                          <StyledParagraph>{name}</StyledParagraph>
                          <StyledParagraph>
                            ${min} - ${max}
                          </StyledParagraph>
                          <StyledParagraph>
                            {Object.keys(players).length}/3
                          </StyledParagraph>
                          <div>
                            <Button
                              type="button"
                              remove
                              disabled={Object.keys(players).length}
                              onClick={() => handleDelete(allTables[i])}
                            >
                              <Paragraph>Delete</Paragraph>
                            </Button>
                            <Button
                              type="button"
                              orange={isPrivate}
                              disabled={
                                balance < min ||
                                Object.keys(players).length >= 3
                              }
                              onClick={() => handleJoin(allTables[i])}
                            >
                              <Paragraph>Join</Paragraph>
                            </Button>
                          </div>
                        </ListItem>
                      )
                  )}
                </List>
              )}
              {active === "public tables" && (
                <List>
                  {publicTables.map(
                    ({ id, isPrivate, name, min, max, players = {} }, i) => (
                      <ListItem key={i.toString()}>
                        <Icon icon={faLockOpen} color="rgb(52, 199, 89)" />
                        <StyledParagraph>{name}</StyledParagraph>
                        <StyledParagraph>
                          ${min} - ${max}
                        </StyledParagraph>
                        <StyledParagraph>
                          {Object.keys(players).length}/3
                        </StyledParagraph>
                        <Button
                          type="button"
                          orange={isPrivate}
                          disabled={
                            balance < min || Object.keys(players).length >= 3
                          }
                          onClick={() => handleJoin(publicTables[i])}
                        >
                          <Paragraph>Join</Paragraph>
                        </Button>
                      </ListItem>
                    )
                  )}
                </List>
              )}
              {active === "private tables" && (
                <List>
                  {privateTables.map(
                    ({ id, isPrivate, name, min, max, players = {} }, i) => (
                      <ListItem key={i.toString()}>
                        <Icon icon={faLock} color="rgb(255, 159, 10)" />
                        <StyledParagraph>{name}</StyledParagraph>
                        <StyledParagraph>
                          ${min} - ${max}
                        </StyledParagraph>
                        <StyledParagraph>
                          {Object.keys(players).length}/3
                        </StyledParagraph>
                        <Button
                          type="button"
                          orange={isPrivate}
                          disabled={
                            balance < min || Object.keys(players).length >= 3
                          }
                          onClick={() => handleJoin(privateTables[i])}
                        >
                          <Paragraph>Join</Paragraph>
                        </Button>
                      </ListItem>
                    )
                  )}
                </List>
              )}
              {active === "official tables" && (
                <List>
                  {officialTables.map(
                    ({ id, isPrivate, name, min, max, players = {} }, i) => (
                      <ListItem key={i.toString()}>
                        <Icon icon={faCertificate} color="rgb(0, 132, 255)" />
                        <StyledParagraph>{name}</StyledParagraph>
                        <StyledParagraph>
                          ${min} - ${max}
                        </StyledParagraph>
                        <StyledParagraph>
                          {Object.keys(players).length}/3
                        </StyledParagraph>
                        <Button
                          type="button"
                          orange={isPrivate}
                          disabled={
                            balance < min || Object.keys(players).length >= 3
                          }
                          onClick={() => handleJoin(officialTables[i])}
                        >
                          <Paragraph>Join</Paragraph>
                        </Button>
                      </ListItem>
                    )
                  )}
                </List>
              )}
              {active === "join" && (
                <Center>
                  <Heading>Join private table</Heading>
                  <Paragraph>Enter password for {joiningTable.name}</Paragraph>
                  <Input
                    type="text"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) =>
                      e.which === 13 && password.length && handleEnterPassword()
                    }
                  />
                  {isError && <Error>Wrong password!</Error>}
                  <Button
                    type="button"
                    disabled={!password.length}
                    onClick={handleEnterPassword}
                  >
                    <Paragraph>Join</Paragraph>
                  </Button>
                </Center>
              )}
              {active === "create table" && (
                <CreateForm setActive={setActive} nickname={nickname} />
              )}
            </> */}
          </Content>
        </Wrapper>
      )}
    </Container>
  );
}

export default Tables;
