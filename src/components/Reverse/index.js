import styled from 'styled-components';

const Reverse = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  height: calc(100% - 1rem);
  width: calc(100% - 1rem);
  border: 0.2rem solid #000000;
  border-radius: 1rem;
  background-image: linear-gradient(
    45deg,
    #000000 16.67%,
    #ffffff 16.67%,
    #ffffff 50%,
    #000000 50%,
    #000000 66.67%,
    #ffffff 66.67%,
    #ffffff 100%
  );
  background-size: 12px 12px;
`;

export default Reverse;
