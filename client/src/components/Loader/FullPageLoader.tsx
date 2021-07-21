import React from "react";
import styled, { ThemeProvider } from "styled-components/macro";
import { AppLoader } from ".";
import usePreferredColorScheme from "../../../../client-old/src/hooks/usePreferredColorScheme";
import { theme } from "../../../../client-old/src/styles";
import { ThemeType, GlobalStyle } from "../../../../client-old/src/styles";

type WrapperProps = {
  theme: ThemeType;
};
const Wrapper = styled.div<WrapperProps>`
  height: 100vh;
  display: grid;
  place-items: center;
`;

function FullPageLoader() {
  const preferredColorScheme = usePreferredColorScheme();
  return (
    <>
      <ThemeProvider theme={theme[preferredColorScheme]}>
        <GlobalStyle />
        <Wrapper theme={theme[preferredColorScheme]}>
          <AppLoader />
        </Wrapper>
      </ThemeProvider>
    </>
  );
}

export default FullPageLoader;
