import styled, { css } from "styled-components";

const Button = styled.button`
  border: none;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.blue};
  color: ${({ theme }) => theme.text};
  font-family: "Montserrat", sans-serif;
  font-size: 2.1rem;
  font-weight: 500;
  padding: 0.5rem 0.8rem;
  margin: 0;
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
`;

export default Button;
