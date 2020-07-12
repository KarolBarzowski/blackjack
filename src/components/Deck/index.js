import styled from "styled-components";

const Deck = styled.div`
  position: absolute;
  top: 25vh;
  right: 4%;
  height: 23.3rem;
  width: 14.4rem;
  padding: 1rem;
  box-shadow: 1.2rem -1.2rem 1rem 0.8rem rgba(0, 0, 0, 0.34),
    -2.1rem 2.1rem 1rem rgba(0, 0, 0, 0.34);
  background-color: #ffffff;
  border-radius: 0 1rem 1rem 0;

  ::before {
    content: "";
    position: absolute;
    top: 1.05rem;
    left: -2.1rem;
    height: 100%;
    width: 2.1rem;
    transform: rotate(0deg) skewY(-45deg);
    background: white;
  }

  ::after {
    content: "";
    position: absolute;
    bottom: -2.1rem;
    left: -1.05rem;
    height: 2.1rem;
    width: calc(100% - 0.8rem);
    /* background-color: rgba(199, 199, 204); */
    /* background-color: #b3b3b3; */
    background: rgb(255, 255, 255);
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(174, 174, 178, 1) 5%
    );
    transform: rotate(0deg) skewX(-45deg);
  }
`;

export default Deck;
