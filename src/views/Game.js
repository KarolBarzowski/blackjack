import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { withRouter, Redirect, Link } from "react-router-dom";
import { database, auth } from "helpers/firebase";
import { FadeIn } from "helpers/animations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import TableTemplate from "templates/TableTemplate";
import Paragraph from "components/Paragraph";
import Loading from "components/Loading";
import Button from "components/Button";

const StyledParagraph = styled(Paragraph)`
  margin: 0 1rem;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 1.6rem;
  color: #000000;
`;

const LeaveButton = styled.button`
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  display: flex;
  align-items: center;
  background-color: transparent;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: color 0.05s ease-in-out;
  outline: none;

  ${StyledParagraph} {
    color: ${({ theme }) => theme.textSecondary};
  }

  ${Icon} {
    font-size: 2.4rem;
    color: ${({ theme }) => theme.textSecondary};
    transition: color 0.05s ease-in-out;
  }

  :hover,
  :focus {
    ${StyledParagraph} {
      color: ${({ theme }) => theme.text};
    }

    ${Icon} {
      color: ${({ theme }) => theme.text};
    }
  }
`;

const InfoWrapper = styled.div`
  position: absolute;
  bottom: 23.3rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.21);
  border-radius: 0.5rem;
  padding: 1rem;
`;

const InfoParagraph = styled(Paragraph)`
  margin-bottom: 1.5rem;
`;

const Blue = styled.span`
  color: ${({ theme }) => theme.blue};
`;

function Game({ match }) {
  const leaveRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRedirect, setIsRedirect] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [player, setPlayer] = useState({});
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    let gameRef;
    let userRef;

    if (user) {
      const userId = user.uid;
      setUserId(userId);

      userRef = database.ref(`/users/${userId}`);
      gameRef = database.ref(`/games/${match.params.tableId}`);

      userRef.once("value").then((snapshot) => {
        if (snapshot.val().currentTable !== match.params.tableId)
          setIsRedirect(true);

        const { nickname, avatarId, balance } = snapshot.val();

        let isOwner = false;

        gameRef
          .child("owner")
          .once("value", (snapshot) => {
            isOwner = snapshot.val() === userId;
          })
          .then(() => {
            const player = {
              nickname,
              avatarId,
              balance,
              isOwner,
              id: userId,
            };

            setIsOwner(isOwner);
            setPlayer(player);
            setIsLoading(false);
          });
      });
    }

    return () => {
      setIsRedirect(false);
      database.ref(`/games/${match.params.tableId}/players/${userId}`).remove();
    };
  }, [match, userId]);

  useEffect(() => {
    const gameRef = database.ref(`/games/${match.params.tableId}`);

    let playersListener;

    gameRef.child(`players`).update(
      {
        [userId]: {
          id: userId,
          ...player,
        },
      },
      () => {
        playersListener = gameRef.child(`players`).on("value", (snapshot) => {
          const playersList = [];

          snapshot.forEach((childSnapshot) => {
            if (userId !== childSnapshot.val().id)
              playersList.push(childSnapshot.val());
          });

          setPlayers([player, ...playersList]);
        });
      }
    );

    return () => {
      gameRef.child("players").off("value", playersListener);
      setPlayers([]);
    };
    // eslint-disable-next-line
  }, [player]);

  useEffect(() => {
    const gameRef = database.ref(`/games/${match.params.tableId}`);

    const handleChangeState = (snapshot) => {
      setIsStarted(snapshot.val());
    };

    gameRef.child("isStarted").on("value", handleChangeState);

    return () => {
      gameRef.child("isStarted").off("value", handleChangeState);
    };
  }, [match]);

  const handleBack = () => {
    database.ref(`/users/${userId}/currentTable`).remove();
    setIsRedirect(true);
  };

  const handleStart = () => {
    database.ref(`/games/${match.params.tableId}`).update({
      isStarted: true,
    });
  };

  if (isRedirect) return <Redirect to="/" />;

  return isLoading ? (
    <Loading />
  ) : (
    <TableTemplate players={players}>
      <LeaveButton onClick={handleBack} ref={leaveRef}>
        <Icon icon={faArrowLeft} />
        <StyledParagraph>Leave table</StyledParagraph>
      </LeaveButton>
      {!isStarted && (
        <InfoWrapper>
          {isOwner ? (
            <>
              <InfoParagraph>Game is ready to start</InfoParagraph>
              <Button type="button" onClick={handleStart}>
                <Paragraph>Start</Paragraph>
              </Button>
            </>
          ) : (
            <Paragraph>
              Waiting for <Blue>host</Blue> to start
            </Paragraph>
          )}
        </InfoWrapper>
      )}
    </TableTemplate>
  );
}

export default withRouter(Game);
