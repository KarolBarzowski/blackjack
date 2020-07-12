import styled from "styled-components";

const ButtonIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background-color: white;
  height: 2.4rem;
  width: 2.4rem;
  margin: 1rem 0 0;
  outline: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s ease-in-out;

  :disabled {
    opacity: 0;
    cursor: default;
  }
`;

export default ButtonIcon;
