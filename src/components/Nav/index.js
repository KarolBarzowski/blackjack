import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { auth, database } from "helpers/firebase";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  height: 6.4rem;
  padding: 0.8rem;
  background-color: ${({ theme }) => theme.dark};
  box-shadow: 0 0 2px -2px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  font-size: 3.4rem;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.1rem;
  transition: transform 0.15s ease-in-out;

  :hover {
    transform: scale(1.05);
  }
`;

const Paragraph = styled.p`
  font-family: "Montserrat", sans-serif;
  font-size: 2.1rem;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 2.4rem;
  color: ${({ theme }) => theme.text};
`;

const LogoutBtn = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 20rem;
`;

function Nav({ userId }) {
  const [nick, setNick] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (userId) {
      // const nickRef = db.collection("users").doc(userId);
      // nickRef.get().then((doc) => {
      //   if (doc.exists) {
      //     setNick(doc.data().nick);
      //     setBalance(doc.data().balance);
      //   } else {
      //     setNick("Wystąpił błąd!");
      //     setBalance("Wystąpił błąd!");
      //   }
      // });
    }
  }, [userId]);

  return (
    <Wrapper>
      <Title as={Link} to="/">
        BLACKJACK
      </Title>
      <Row>
        <Paragraph>{balance}</Paragraph>
        <Paragraph>{nick}</Paragraph>
        <LogoutBtn type="button" onClick={() => auth.signOut()}>
          <Icon icon={faSignOutAlt} fixedWidth />
        </LogoutBtn>
      </Row>
    </Wrapper>
  );
}

export default Nav;
