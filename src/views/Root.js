import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { auth } from "helpers/firebase";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "theme/GlobalStyle";
import { theme } from "theme/mainTheme";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Welcome from "views/Welcome";
import NotFound from "views/NotFound";
import Single from "views/Single";
import Login from "views/Login";
import Nav from "components/Nav/Nav";

function Root() {
  const [isUser, setIsUser] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsUser(true);
        setUserId(user.uid);
      } else {
        setIsUser(false);
      }
    });
  }, [isUser]);

  return (
    <div>
      <Helmet>
        <title>Blackjack</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap"
          rel="stylesheet"
        /> */}
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <GlobalStyle />
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {!isUser && <Redirect to="/login" />}
          {/* {isUser && <Nav userId={userId} />} */}
          <Switch>
            <Route path="/" exact component={Welcome} />
            <Route path="/login" exact component={Login} />
            <Route path="/play" exact component={Single} />
            <Route component={NotFound} />
          </Switch>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default Root;
