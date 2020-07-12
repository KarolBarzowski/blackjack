import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    *, *::before, ::after {
        box-sizing: border-box;
    }

    html {
        font-size: 62.5%;
    }

    body {
        margin: 0;
        padding: 0;
        font-size: 1.6rem;
        font-family: 'Montserrat', sans-serif;
        background-color: rgb(35, 39, 42);
        color: rgba(255, 255, 255, .87);
    }
`;

export default GlobalStyle;
