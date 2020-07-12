import styled from 'styled-components';

const Deck = styled.div`
  position: absolute;
  top: 25vh;
  right: 5%;
  height: 23.3rem;
  width: 14.4rem;
  padding: 1rem;
  box-shadow: 2.2rem -2.2rem 1rem 1rem rgba(0, 0, 0, 0.34),
    -3rem 3rem 1rem rgba(0, 0, 0, 0.34);
  background-color: #ffffff;
  border-radius: 0 1rem 0 0;

  ::before {
    content: "";
    position: absolute;
    top: 2.6rem;
    left: -5.2rem;
    height: 100%;
    width: 5.2rem;
    background: #ffffff;
    transform: rotate(0deg) skewY(-45deg);
  }

  ::after {
    content: "";
    position: absolute;
    bottom: -5.2rem;
    left: -2.6rem;
    height: 5.2rem;
    width: 100%;
    background: #ffffff;
    transform: rotate(0deg) skewX(-45deg);
  }
`;

export default Deck;