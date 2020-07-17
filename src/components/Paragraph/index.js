import styled from "styled-components";

const Paragraph = styled.p`
  font-family: "Montserrat", sans-serif;
  font-size: 2.1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

export default Paragraph;
