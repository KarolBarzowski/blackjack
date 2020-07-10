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

    .paragraph {
        font-family: 'EB Garamond', serif;
        font-weight: 500;
        font-size: 3.4rem;
        color: rgba(255, 255, 255, .55);
    }

    .bold {
        font-size: 5.5rem;
        font-weight: 700;
    }

    .dark {
        color: rgba(0, 0, 0, .34);
    }
    
    .absolute {
        position: absolute;
    }

    .second {
        top: 8.5rem;
    }
`;

export default GlobalStyle;
