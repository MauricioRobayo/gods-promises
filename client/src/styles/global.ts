import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

export const mediumSize = "768px";
export const smallSize = "320px";

export const GlobalStyle = createGlobalStyle`
  ${normalize}
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    color: #444;
    font-family: Lato, serif;
  }
`;
