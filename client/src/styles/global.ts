import { createGlobalStyle } from "styled-components";
export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    box-sizing: border-box;
  }

  body {
    block-size: 100%;
    color: ${({ theme }) => theme.color.text1};
    background-color: ${({ theme }) => theme.color.surface2};
    font-family: ${({ theme }) => theme.font.family.primary};
  }
  a {
    color: ${({ theme }) => theme.color.brand}

  }
`;
