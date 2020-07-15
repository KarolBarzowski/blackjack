import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { auth, session, database } from "helpers/firebase";
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faAt,
  faKey,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Heading from "components/Heading";

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`;

const StyledHeading = styled(Heading)`
  font-size: 3.4rem;
`;

const StyledParagraph = styled.p`
  font-size: 1.6rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  margin: 1rem 0;
`;

const Form = styled.form`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.dark};
  border-radius: 1.5rem;
  padding: 1.5rem 1.5rem 2.5rem;
  width: 40rem;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.12),
    0 4px 4px rgba(0, 0, 0, 0.12), 0 8px 8px rgba(0, 0, 0, 0.12),
    0 16px 16px rgba(0, 0, 0, 0.12);
`;

const Label = styled.label`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 2.1rem;
  color: ${({ theme }) => theme.textSecondary};
  transition: color 0.1s ease-in-out;
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  padding: 1rem 1.5rem;
  color: rgb(255, 255, 255, 0.87);
  font-family: "Montserrat", sans-serif;
  font-size: 1.6rem;
  font-weight: 500;
  width: 26.2rem;
  outline: none;

  ::placeholder {
    color: rgb(99, 99, 102);
  }
`;

const PasswordBtn = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  padding: 0 1rem 0 0.5rem;

  :hover ${Icon} {
    color: ${({ theme }) => theme.text};
  }
`;

const PasswordInput = styled(Input)`
  padding-right: 1rem;
  width: 22rem;
`;

const Link = styled.button`
  background-color: transparent;
  border: none;
  margin: 0;
  padding: 0;
  font-size: 1.6rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  color: rgb(10, 132, 255);
  text-decoration: underline;
  margin-left: 0.5rem;
  outline: none;
  cursor: pointer;
  transition: color 0.1s ease-in-out;

  :hover {
    color: rgb(0, 122, 255);
  }
`;

const Button = styled.button`
  position: relative;
  width: 30rem;
  border: none;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  font-size: 1.6rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  margin-top: 0.5rem;
  background-color: rgb(10, 132, 255);
  color: rgba(255, 255, 255, 0.87);
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;

  :hover {
    background-color: rgb(0, 122, 255);
  }

  :disabled {
    background-color: rgba(0, 132, 255, 0.39);
    cursor: default;
  }
`;

const Row = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  margin: 0.5rem 0;
  padding: 0 0 0 1.5rem;
  border: 1px solid rgb(99, 99, 102);
  border-radius: 0.5rem;
  min-width: 30rem;
`;

const Error = styled.p`
  font-family: "Montserrat", sans-serif;
  font-size: 1.6rem;
  font-weight: 500;
  color: rgb(255, 69, 58);
  margin: 0.5rem 0;
  transition: opacity 0.15s ease-in-out 0.05s;

  ${({ appear }) =>
    appear
      ? css`
          visibility: visible;
          opacity: 1;
        `
      : css`
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.15s ease-in-out 0.05s, visibility 0s linear 0.4s;
        `}
`;

const HiddenCheckbox = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 21px;
  height: 21px;
  background: ${({ checked, theme }) => (checked ? theme.blue : "white")};
  border-radius: 3px;
  margin-right: 0.5rem;
  transition: box-shadow 150ms;

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.blue};
  }

  ${Icon} {
    visibility: ${({ isChecked }) => (isChecked ? "visible" : "hidden")};
  }
`;

const CheckboxContainer = styled.label`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  cursor: pointer;
  width: 30rem;
`;

const Checkmark = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;

function Login() {
  const [isUser, setIsUser] = useState(false);
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isRemember, setIsRemember] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsUser(true);
      } else {
        setIsUser(false);
      }
    });
  }, [isUser]);

  useEffect(() => {
    if (isRegister && (password.length || confirmPassword.length)) {
      if (password !== confirmPassword) {
        setIsError(true);
        setErrorMsg(`Passwords are not equal!`);
      } else if (password.length < 6) {
        setIsError(true);
        setErrorMsg(`Password min. 6 characters!`);
      } else {
        setIsError(false);
        setTimeout(() => setErrorMsg(""), 400);
      }
    } else {
      setIsError(false);
      setTimeout(() => setErrorMsg(""), 400);
    }
  }, [password, confirmPassword, isRegister]);

  const getErrorMsg = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "Email is already taken!";
      case "auth/invalid-email":
        return "Invalid email!";
      case "auth/operation-not-allowed":
        return "Error!";
      case "auth/weak-password":
        return "Password min. 6 characters!";
      case "auth/user-disabled":
        return "Account is disabled!";
      case "auth/wrong-password":
        return "Wrong password!";
      case "auth/user-not-found":
        return "User not found!";
      default:
        break;
    }
  };

  const handleValidate = (e) => {
    setIsValidating(true);
    e.preventDefault();
    if (isRegister) {
      if (!nick.length) {
        setIsError(true);
        setErrorMsg("What about nickname?");
        setIsValidating(false);
      } else {
        auth
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
            database.ref("users/" + auth.currentUser.uid).set({
              nick,
              balance: 200,
            });
            setIsValidating(false);
          })
          .catch(({ code }) => {
            setIsError(true);
            setErrorMsg(getErrorMsg(code));
            setIsValidating(false);
          });
      }
    } else if (isRemember) {
      auth
        .signInWithEmailAndPassword(email, password)
        .then(() => setIsValidating(false))
        .catch(({ code }) => {
          setIsError(true);
          setErrorMsg(getErrorMsg(code));
          setIsValidating(false);
        });
    } else {
      auth
        .setPersistence(session)
        .then(() => {
          auth.signInWithEmailAndPassword(email, password);
          setIsValidating(false);
        })
        .catch(({ code }) => {
          setIsError(true);
          setErrorMsg(getErrorMsg(code));
          setIsValidating(false);
        });
    }
  };

  const handleForgotPassword = (e) => {
    setIsValidating(true);
    e.preventDefault();
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setIsEmailSent(true);
      })
      .catch(({ code }) => {
        setIsError(true);
        setErrorMsg(getErrorMsg(code));
      });
    setTimeout(() => {
      setIsValidating(false);
    }, 500);
  };

  if (isUser) return <Redirect to="/" />;

  return (
    <Wrapper>
      {isForgotPassword ? (
        <Form onSubmit={handleForgotPassword}>
          <StyledHeading>Forgot password</StyledHeading>
          {isEmailSent ? (
            <>
              <StyledParagraph>Reset link sent to your email!</StyledParagraph>
              <Button type="button" onClick={() => setIsForgotPassword(false)}>
                Back to login
              </Button>
            </>
          ) : (
            <>
              <Row>
                <Label htmlFor="email">
                  <Icon icon={faAt} />
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Row>
              <Error appear={isError}>{errorMsg}</Error>
              <Button type="submit" disabled={isValidating}>
                Reset password
              </Button>
              <Button type="button" onClick={() => setIsForgotPassword(false)}>
                Back to login
              </Button>
            </>
          )}
        </Form>
      ) : (
        <Form onSubmit={handleValidate}>
          <StyledHeading>{isRegister ? "Sign up" : "Sign in"}</StyledHeading>
          {isRegister && (
            <Row>
              <Label htmlFor="nick">
                <Icon icon={faUserCircle} />
              </Label>
              <Input
                type="text"
                id="nick"
                name="nick"
                placeholder="Nickname"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
              />
            </Row>
          )}
          <Row>
            <Label htmlFor="email">
              <Icon icon={faAt} />
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Row>
          <Row>
            <Label htmlFor="password">
              <Icon icon={faKey} />
            </Label>
            <PasswordInput
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordBtn
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <Icon icon={showPassword ? faEyeSlash : faEye} fixedWidth />
            </PasswordBtn>
          </Row>
          {isRegister && (
            <Row>
              <Label htmlFor="confirmPassword">
                <Icon icon={faKey} />
              </Label>
              <Input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Row>
          )}
          {!isRegister && (
            <CheckboxContainer>
              <HiddenCheckbox
                type="checkbox"
                checked={isRemember}
                onChange={() => setIsRemember(!isRemember)}
              />
              <StyledCheckbox checked={isRemember}>
                <Checkmark viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </Checkmark>
              </StyledCheckbox>
              <StyledParagraph>Remember me</StyledParagraph>
            </CheckboxContainer>
          )}
          <Error appear={isError}>{errorMsg}</Error>
          <Button type="submit" disabled={isValidating}>
            {isRegister ? "Sign up" : "Login"}
          </Button>
          <StyledParagraph>
            {isRegister
              ? "Already have an account?"
              : "Doesn't have an account?"}
            <Link type="button" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Sign in!" : "Sign up!"}
            </Link>
          </StyledParagraph>
          {!isRegister && (
            <Link
              type="button"
              onClick={() => setIsForgotPassword(!isForgotPassword)}
            >
              Forgot password?
            </Link>
          )}
        </Form>
      )}
    </Wrapper>
  );
}

export default Login;
