import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { getAvatar, getLabel } from 'helpers/functions';
import { auth } from 'helpers/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPiggyBank, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Paragraph from 'components/Paragraph';

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
  box-shadow: 0 1px 0 rgba(4, 4, 5, 0.2), 0 1.5px 0 rgba(6, 6, 7, 0.05), 0 2px 0 rgba(4, 4, 5, 0.05);
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
  cursor: pointer;
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
  transition: background-color 0.05s ease-in-out, border-radius 0.15s ease-in-out;

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

function Sidebar({ nickname, balance, avatarId, active, setActive }) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Wrapper>
      <ProfileInfo>
        <Avatar>{getAvatar(avatarId)}</Avatar>
        <Column>
          <Paragraph>{nickname}</Paragraph>
          <StyledParagraph
            onMouseOver={() => setIsHover(true)}
            onFocus={() => setIsHover(true)}
            onMouseOut={() => setIsHover(false)}
            onBlur={() => setIsHover(false)}
          >
            {isHover ? `$${balance}` : `$${getLabel(balance)}`}
          </StyledParagraph>
        </Column>
        <ButtonIcon type="button" title="Log Out" onClick={() => auth.signOut()}>
          <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
        </ButtonIcon>
      </ProfileInfo>
      <List>
        <div>
          <ListItem>
            <Button type="button" onClick={() => setActive('play')} active={active === 'play'}>
              <Paragraph>
                <FontAwesomeIcon icon={faPlay} fixedWidth transform="left-5" />
                Play
              </Paragraph>
            </Button>
          </ListItem>
          <ListItem>
            <Button type="button" onClick={() => setActive('bank')} active={active === 'bank'}>
              <Paragraph>
                <FontAwesomeIcon icon={faPiggyBank} fixedWidth transform="left-5" />
                Bank
              </Paragraph>
            </Button>
          </ListItem>
        </div>
      </List>
    </Wrapper>
  );
}

Sidebar.propTypes = {
  nickname: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
  avatarId: PropTypes.number,
  active: PropTypes.string.isRequired,
  setActive: PropTypes.func.isRequired,
};

Sidebar.defaultProps = {
  avatarId: 0,
};

export default Sidebar;
