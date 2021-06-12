import { createGlobalStyle } from "styled-components";
export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    color: ${({ theme }) => theme.color.text1};
    background-color: ${({ theme }) => theme.color.surface1};
    font-family: ${({ theme }) => theme.font.primary};
  }
`;
