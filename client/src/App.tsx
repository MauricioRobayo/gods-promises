import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Route, useLocation, Redirect } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import styled from "styled-components/macro";
import { Normalize } from "styled-normalize";
import GPromise from "./features/gPromises/GPromise";
import { Home } from "./features/home";
import {
  DEFAULT_LANG,
  LanguageSelector,
  supportedLngs,
} from "./features/i18next";
import usePreferredColorScheme from "./hooks/usePreferredColorScheme";
import { GlobalStyle, theme } from "./styles";
import { PROMISE_PATH } from "./config";
import { Navbar } from "./features/Navbar";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
`;

const Footer = styled.footer`
  flex: 1;
  align-items: flex-end;
  display: flex;
  justify-content: center;
  padding: 1rem 0;
`;

const basePath = `/(${supportedLngs.join("|")})`;

function App() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const preferredColorScheme = usePreferredColorScheme();

  useEffect(() => {
    const [, lang] = pathname.split("/");
    i18n.changeLanguage(lang);
  }, [pathname, i18n]);

  return (
    <ThemeProvider theme={theme[preferredColorScheme]}>
      <Normalize />
      <GlobalStyle />
      <Wrapper>
        <Navbar />
        <Main>
          <Route exact path={basePath}>
            <Home />
          </Route>
          <Route exact path={`${basePath}/${PROMISE_PATH}/:gPromiseId`}>
            <GPromise />
          </Route>
          <Route exact path="/">
            <Redirect to={`/${DEFAULT_LANG}`} />
          </Route>
        </Main>
        <Footer></Footer>
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
