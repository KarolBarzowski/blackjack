import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { withRouter, Redirect, Link } from "react-router-dom";
import { database, auth } from "helpers/firebase";
import { FadeIn } from "helpers/animations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import TableTemplate from "templates/TableTemplate";
import Paragraph from "components/Paragraph";

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

  :hover {
    ${StyledParagraph} {
      color: ${({ theme }) => theme.text};
    }

    ${Icon} {
      color: ${({ theme }) => theme.text};
    }
  }
`;

function Game({ match }) {
  const leaveRef = useRef(null);

  const [isRedirect, setIsRedirect] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      setUserId(userId);

      database
        .ref(`/users/${userId}/currentTable`)
        .once("value")
        .then((snapshot) => {
          if (snapshot.val() !== match.params.tableId) setIsRedirect(true);
        });

      database.ref(`/games/${match.params.tableId}/players`).update({
        [userId]: {
          id: userId,
        },
      });
    }

    return () => {
      setIsRedirect(false);
      database.ref(`/games/${match.params.tableId}/players/${userId}`).remove();
    };
  }, [match, userId]);

  const handleBack = () => {
    database.ref(`/users/${userId}/currentTable`).remove();
    setIsRedirect(true);
  };

  if (isRedirect) return <Redirect to="/" />;

  return (
    <TableTemplate>
      <LeaveButton onClick={handleBack} ref={leaveRef}>
        <Icon icon={faArrowLeft} />
        <StyledParagraph>Leave table</StyledParagraph>
      </LeaveButton>
    </TableTemplate>
  );
}

export default withRouter(Game);
