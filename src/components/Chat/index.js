import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { SlideIn, Disappear } from 'helpers/animations';

const ChatMsg = styled.p`
  font-size: 1.6rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  margin: 0.25rem 0 0;
  padding: 0.8rem;
  border-radius: 0.5rem;
  background-color: rgba(0, 0, 0, 0.34);
  transition: opacity 0.1s ease-in-out;
  animation: ${SlideIn} 0.5s ease-in-out backwards 0.05s;

  ${({ hide }) =>
    hide &&
    css`
      display: none;
    `}

  ${({ disappear }) =>
    disappear &&
    css`
      animation: ${Disappear} 0.5s ease-in-out forwards;
      transition: opacity 0.5s ease-in-out;
      opacity: 0;
    `}
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  transition: opacity 0.1s ease-in-out;
  z-index: 2;
  opacity: 0.38;

  :hover {
    opacity: 1;

    ${ChatMsg} {
      transition: opacity 0.1s ease-in-out;
      opacity: 1;
    }
  }

  ${({ hide }) =>
    hide &&
    css`
      opacity: 0;
    `}
`;

const BlueParagraph = styled.span`
  color: ${({ theme }) => theme.blue};
  padding: 0;
  margin: 0;
  font-weight: 500;
`;

function Chat({ logs }) {
  const chatTimer = useRef(null);
  const [isChatHidden, setIsChatHidden] = useState(false);

  useEffect(() => {
    chatTimer.current = setTimeout(() => {
      setIsChatHidden(true);
    }, 5000);

    return () => clearTimeout(chatTimer.current);
  }, []);

  useEffect(() => {
    clearTimeout(chatTimer);
    setIsChatHidden(false);
    chatTimer.current = setTimeout(() => {
      setIsChatHidden(true);
    }, 5000);
  }, [logs]);

  const handleChatAppear = () => {
    clearTimeout(chatTimer.current);
    setIsChatHidden(false);
  };

  const handleChatDisappear = () => {
    chatTimer.current = setTimeout(() => {
      setIsChatHidden(true);
    }, 5000);
  };

  return (
    <ChatContainer
      hide={isChatHidden}
      onMouseOver={handleChatAppear}
      onFocus={handleChatAppear}
      onMouseOut={handleChatDisappear}
      onBlur={handleChatDisappear}
    >
      {logs.map(({ time, msg }, i) => (
        <ChatMsg key={i.toString()} hide={logs.length - 6 >= i} disappear={i !== logs.length - 1}>
          <BlueParagraph>[{time}]</BlueParagraph> {msg}
        </ChatMsg>
      ))}
    </ChatContainer>
  );
}

Chat.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.object),
};

Chat.defaultProps = {
  logs: [],
};

export default Chat;
