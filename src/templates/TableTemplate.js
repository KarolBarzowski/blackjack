import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import backgroundPattern from "assets/images/bg.png";
import { ReactComponent as Text } from "assets/images/text.svg";
import { FadeIn } from "helpers/animations";

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 3.4rem 1.5rem 5.5rem 1.5rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  background-color: ${({ theme }) => theme.table};
  background-image: url(${backgroundPattern});
  background-repeat: repeat;
  box-shadow: inset 1px 1px 120px 30px rgba(3, 3, 3, 0.5);
  animation: ${FadeIn} 0.5s ease-in-out forwards;
`;

const TableText = styled.div`
  position: absolute;
  top: 22%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  user-select: none;
`;

function TableTemplate({ children }) {
  return (
    <Wrapper>
      <TableText>
        <Text />
      </TableText>
      {children}
    </Wrapper>
  );
}

export default TableTemplate;
