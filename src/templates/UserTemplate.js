import React, { useState } from "react";
import styled from "styled-components";
import Nav from "components/Nav/Nav";

function UserTemplate({ children }) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}

export default UserTemplate;
