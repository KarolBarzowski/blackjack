import styled from 'styled-components';

const Heading = styled.h1`
  font-size: 3.4rem;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  color: ${({ theme }) => theme.text};
`;

export default Heading;
