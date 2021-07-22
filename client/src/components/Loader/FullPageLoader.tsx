import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { AppLoader } from ".";
import { ThemeType, GlobalStyle, lightTheme } from "../../styles";

type WrapperProps = {
  theme: ThemeType;
};
const Wrapper = styled.div<WrapperProps>`
  height: 100vh;
  display: grid;
  place-items: center;
`;

function FullPageLoader() {
  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Wrapper theme={lightTheme}>
          <AppLoader />
        </Wrapper>
      </ThemeProvider>
    </>
  );
}

export default FullPageLoader;
