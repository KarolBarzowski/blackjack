import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { getAvatar } from "helpers/functions";
import { auth } from "helpers/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faPlus,
  faListUl,
  faCertificate,
  faLock,
  faLockOpen,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Paragraph from "components/Paragraph";

const Wrapper = styled.div`
  height: 100%;
  width: 35rem;
  display: flex;
  flex-flow: column nowrap;
  border-radius: 1.5rem 0 0 1.5rem;
  background-color: ${({ theme }) => theme.backgroundSecondary};
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 1rem;
  height: 6.4rem;
  width: 100%;
  box-shadow: 0 1px 0 rgba(4, 4, 5, 0.2), 0 1.5px 0 rgba(6, 6, 7, 0.05),
    0 2px 0 rgba(4, 4, 5, 0.05);
`;

const Avatar = styled.div`
  min-width: 4.8rem;
  max-width: 4.8rem;
  min-height: 4.8rem;
  max-height: 4.8rem;
  margin-right: 1.5rem;
`;

const Column = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  width: 100%;
`;

const StyledParagraph = styled(Paragraph)`
  font-size: 1.6rem;
  font-weight: 400;
  color: ${({ theme }) => theme.textSecondary};
`;

const List = styled.ul`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  list-style-type: none;
  height: 100%;
  margin: 0;
  padding: 1rem 0 1rem 1rem;
`;

const ListItem = styled.li`
  height: 6.4rem;
  width: 100%;
  margin: 0.5rem 0;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  border: 0;
  border-radius: 1rem;
  padding: 1.5rem;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.05s ease-in-out,
    border-radius 0.15s ease-in-out;

  :hover {
    background-color: ${({ theme }) => theme.hover};
  }

  :focus {
    outline: none;
    background-color: ${({ theme }) => theme.hover};
  }

  :disabled {
    opacity: 0.38;
    cursor: default;

    :hover {
      background-color: transparent;
    }
  }

  ${({ active }) =>
    active &&
    css`
      background-color: ${({ theme }) => theme.dark};
      border-radius: 1rem 0 0 1rem;

      :hover {
        background-color: ${({ theme }) => theme.dark};
      }

      :focus {
        background-color: ${({ theme }) => theme.dark};
      }
    `}
`;

const ButtonIcon = styled.button`
  border: none;
  background-color: transparent;
  font-size: 2.1rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;

function Sidebar({
  nickname,
  balance,
  avatarId,
  // active,
  // setActive,
  // allTablesLength,
  // hasTable,
  // publicTablesLength,
  // privateTablesLength,
  // officialTablesLength,
}) {
  return (
    <Wrapper>
      <ProfileInfo>
        <Avatar>{getAvatar(avatarId)}</Avatar>
        <Column>
          <Paragraph>{nickname}</Paragraph>
          <StyledParagraph>${balance}</StyledParagraph>
        </Column>
        <ButtonIcon
          type="button"
          title="Log Out"
          onClick={() => auth.signOut()}
        >
          <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
        </ButtonIcon>
      </ProfileInfo>
      <List>
        {/* <div>
          <ListItem>
            <Button
              type="button"
              onClick={() => setActive("all tables")}
              active={active === "all tables"}
            >
              <Paragraph>
                <FontAwesomeIcon
                  icon={faListUl}
                  fixedWidth
                  transform="left-5"
                />
                All tables
              </Paragraph>
              <Paragraph>{allTablesLength}</Paragraph>
            </Button>
          </ListItem>
          <ListItem>
            <Button
              type="button"
              onClick={() => setActive("official tables")}
              active={active === "official tables"}
            >
              <Paragraph>
                <FontAwesomeIcon
                  icon={faCertificate}
                  fixedWidth
                  transform="left-5"
                  color="rgb(0, 132, 255)"
                />
                Official tables
              </Paragraph>
              <Paragraph>{officialTablesLength}</Paragraph>
            </Button>
          </ListItem>
          <ListItem>
            <Button
              type="button"
              onClick={() => setActive("public tables")}
              active={active === "public tables"}
            >
              <Paragraph>
                <FontAwesomeIcon
                  icon={faLockOpen}
                  fixedWidth
                  transform="left-5"
                  color="rgb(52, 199, 89)"
                />
                Public tables
              </Paragraph>
              <Paragraph>{publicTablesLength}</Paragraph>
            </Button>
          </ListItem>
          <ListItem>
            <Button
              type="button"
              onClick={() => setActive("private tables")}
              active={active === "private tables"}
            >
              <Paragraph>
                <FontAwesomeIcon
                  icon={faLock}
                  fixedWidth
                  transform="left-5"
                  color="rgb(255, 159, 10)"
                />
                Private tables
              </Paragraph>
              <Paragraph>{privateTablesLength}</Paragraph>
            </Button>
          </ListItem>
          {hasTable ? (
            <ListItem>
              <Button
                type="button"
                onClick={() => setActive("your tables")}
                active={active === "your tables"}
              >
                <Paragraph>
                  <FontAwesomeIcon
                    icon={faUser}
                    fixedWidth
                    transform="left-5"
                  />
                  Your tables
                </Paragraph>
                <Paragraph>{hasTable}</Paragraph>
              </Button>
            </ListItem>
          ) : null}
        </div>
        <ListItem>
          <Button
            type="button"
            onClick={() => setActive("create table")}
            active={active === "create table"}
            disabled={hasTable}
          >
            <Paragraph>
              <FontAwesomeIcon icon={faPlus} transform="left-5" fixedWidth />
              Create table
            </Paragraph>
            <Paragraph>{hasTable ? 1 : 0}/1</Paragraph>
          </Button>
        </ListItem> */}
      </List>
    </Wrapper>
  );
}

export default Sidebar;
