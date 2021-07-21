import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { Normalize } from "styled-normalize";
import { Layout } from "../components/Layout";
import { GlobalStyle, lightTheme } from "../styles";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <Normalize />
        <GlobalStyle />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
}
export default MyApp;
