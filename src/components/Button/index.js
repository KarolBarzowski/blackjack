import styled, { css } from "styled-components";

const Button = styled.button`
  border: none;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.blue};
  color: ${({ theme }) => theme.text};
  font-family: "Montserrat", sans-serif;
  font-size: 2.1rem;
  font-weight: 500;
  padding: 0.8rem;
  height: 4.2rem;
  min-width: 12.5rem;
  margin: 0 0.5rem ${({ margin }) => (margin ? "1rem" : "-1rem")};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  cursor: pointer;
  transition: background-color 0.05s ease-in-out;
  outline: none;

  :hover:not(:disabled) {
    background-color: #0073ee;
  }

  :disabled {
    cursor: default;
    opacity: 0.38 !important;
  }

  ${({ small }) =>
    small &&
    css`
      min-width: 8.9rem;
    `}
`;

export default Button;
