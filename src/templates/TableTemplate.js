import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { gsap } from "gsap";
import backgroundPattern from "assets/images/bg.png";
import { ReactComponent as Text } from "assets/images/text.svg";
import { getAvatar } from "helpers/functions";
import { FadeIn } from "helpers/animations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCog } from "@fortawesome/free-solid-svg-icons";
import Paragraph from "components/Paragraph";

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

const Info = styled.div`
  position: absolute;
  top: -3rem;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.21);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

function TableTemplate({ children, players, currentInfo }) {
  const infoRef = useRef(null);

  const [info, setInfo] = useState("");

  useEffect(() => {
    switch (currentInfo) {
      case "bet":
        setInfo("Place your bets!");
        break;

      default:
        break;
    }

    if (currentInfo.length) {
      gsap.defaults({ ease: "power2.inOut", duration: 0.75 });

      const tl = gsap.timeline();

      tl.to(infoRef.current, {
        y: 64,
        delay: 0.5,
      }).to(infoRef.current, {
        y: 0,
        delay: 2,
      });
    }
  }, [currentInfo]);

  return (
    <Wrapper>
      <TableText>
        <Text />
      </TableText>
      <Info ref={infoRef}>
        <StyledParagraph>{info}</StyledParagraph>
      </Info>
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
