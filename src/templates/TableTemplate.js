import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import backgroundPattern from "assets/images/bg.png";
import { ReactComponent as Text } from "assets/images/text.svg";
import { getAvatar } from "helpers/functions";
import { FadeIn } from "helpers/animations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCog } from "@fortawesome/free-solid-svg-icons";
import Paragraph from "components/Paragraph";

const Wrapper = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  padding: 3.4rem 1.5rem 5.5rem 1.5rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  background-color: ${({ theme }) => theme.table};
  background-image: url(${backgroundPattern});
  background-repeat: repeat;
  box-shadow: inset 1px 1px 120px 30px rgba(3, 3, 3, 0.5);
  animation: ${FadeIn} 0.5s ease-in-out forwards;
`;

const TableText = styled.div`
  position: absolute;
  top: 22%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  user-select: none;
`;

const Players = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  height: 14.4rem;
`;

const PlayerInfo = styled.div`
  position: absolute;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.21);
  border-radius: 0.5rem;
  padding: 1rem;

  :first-of-type {
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
  }

  :nth-of-type(2) {
    bottom: 5.5rem;
    left: 5.5rem;
  }

  :nth-of-type(3) {
    bottom: 5.5rem;
    right: 5.5rem;
  }
`;

const Avatar = styled.div`
  min-width: 4.8rem;
  max-width: 4.8rem;
  min-height: 4.8rem;
  max-height: 4.8rem;
  margin-right: 1rem;
`;

const Column = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const StyledParagraph = styled(Paragraph)`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1.6rem;
`;

const BlueParagraph = styled(Paragraph)`
  color: ${({ isOwner, theme }) => (isOwner ? theme.blue : theme.text)};
`;

function TableTemplate({ children, players }) {
  return (
    <Wrapper>
      <TableText>
        <Text />
      </TableText>
      <Players>
        {players.map(({ avatarId, balance, nickname, isOwner }, i) => (
          <PlayerInfo key={i.toString()}>
            <Avatar>{getAvatar(avatarId)}</Avatar>
            <Column>
              <BlueParagraph isOwner={isOwner}>{nickname}</BlueParagraph>
              <StyledParagraph>${balance}</StyledParagraph>
            </Column>
          </PlayerInfo>
        ))}
      </Players>
      {children}
    </Wrapper>
  );
}

export default TableTemplate;
