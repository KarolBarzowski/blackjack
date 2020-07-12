import styled from "styled-components";

const Deck = styled.div`
  position: absolute;
  top: 25vh;
  right: 4%;
  height: 23.3rem;
  width: 14.4rem;
  padding: 1rem;
  box-shadow: 2.2rem -2.2rem 1rem 1rem rgba(0, 0, 0, 0.34),
    -3rem 3rem 1rem rgba(0, 0, 0, 0.34);
  background-color: #ffffff;
  border-radius: 0 1rem 1rem 0;

  ::before {
    content: "";
    position: absolute;
    top: 1.7rem;
    left: -3.4rem;
    height: 100%;
    width: 3.4rem;
    transform: rotate(0deg) skewY(-45deg);
    background: linear-gradient(
      90deg,
      #ffffff 0%,
      #000000 5%,
      #ffffff 10%,
      #000000 15%,
      #ffffff 20%,
      #000000 25%,
      #ffffff 30%,
      #000000 35%,
      #ffffff 40%,
      #000000 45%,
      #ffffff 50%,
      #000000 55%,
      #ffffff 60%,
      #000000 65%,
      #ffffff 70%,
      #000000 75%,
      #ffffff 80%,
      #000000 85%,
      #ffffff 90%,
      #000000 95%,
      #ffffff 100%
    );
  }

  ::after {
    content: "";
    position: absolute;
    bottom: -3.4rem;
    left: -1.7rem;
    height: 3.4rem;
    width: calc(100% - 0.8rem);
    background: linear-gradient(
      0deg,
      #ffffff 0%,
      #000000 5%,
      #ffffff 10%,
      #000000 15%,
      #ffffff 20%,
      #000000 25%,
      #ffffff 30%,
      #000000 35%,
      #ffffff 40%,
      #000000 45%,
      #ffffff 50%,
      #000000 55%,
      #ffffff 60%,
      #000000 65%,
      #ffffff 70%,
      #000000 75%,
      #ffffff 80%,
      #000000 85%,
      #ffffff 90%,
      #000000 95%,
      #ffffff 100%
    );
    transform: rotate(0deg) skewX(-45deg);
  }
`;

export default Deck;
