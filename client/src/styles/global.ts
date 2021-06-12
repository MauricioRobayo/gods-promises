import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";
import { sharedStyles } from "./theme";

export const GlobalStyle = createGlobalStyle`
  ${normalize}
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    color: #444;
    font-family: ${sharedStyles.font.primary};
  }
`;
