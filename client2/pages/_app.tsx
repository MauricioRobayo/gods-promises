import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, lightTheme } from "../styles";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Component {...pageProps} />;
      </ThemeProvider>
    </>
  );
}
export default MyApp;
