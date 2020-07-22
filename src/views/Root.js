import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { auth, database } from "helpers/firebase";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "theme/GlobalStyle";
import { theme } from "theme/mainTheme";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import NotFound from "views/NotFound";
import Single from "views/Single";
import Login from "views/Login";
import Tables from "views/Tables";
import Game from "views/Game";

function Root() {
  const [isUser, setIsUser] = useState(true);
  const [userId, setUserId] = useState(null);
  // const [isRedirect, setIsRedirect] = useState(false);
  // const [redirectTo, setRedirectTo] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsUser(true);
        setUserId(user.uid);
      } else {
        setIsUser(false);
      }
    });
  }, [isUser, userId]);

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
          {/* {isRedirect && <Redirect to={`/tables/${redirectTo}`} />} */}
          {/* {isUser && <Nav userId={userId} />} */}
          <Switch>
            <Route path="/" exact render={() => <Tables userId={userId} />} />
            {/* <Route path="/tables/:tableId" component={Game} /> */}
            <Route path="/login" component={Login} />
            <Route path="/play" render={() => <Game userId={userId} />} />
            <Route component={NotFound} />
          </Switch>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default Root;
