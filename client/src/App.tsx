import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import styled from "styled-components/macro";
import { Normalize } from "styled-normalize";
import GPromise from "./features/gPromises/GPromise";
import { Home } from "./features/home";
import { LanguageSelector } from "./features/i18next";
import Twemoji from "./features/twemoji/Twemoji";
import usePreferredColorScheme from "./hooks/usePreferredColorScheme";
import { GlobalStyle, theme } from "./styles";
import { PROMISE_PATH } from "./styles/config";

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

const Title = styled.h1`
  font-size: 1.75rem;
  @media ${({ theme }) => theme.device.medium} {
    font-size: 2rem;
  }
  margin: 2em 0 2em;
  font-weight: 900;
`;

const Footer = styled.footer`
  flex: 1;
  align-items: flex-end;
  display: flex;
  justify-content: center;
  padding: 1rem 0;
`;

function App() {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const preferredColorScheme = usePreferredColorScheme();

  useEffect(() => {
    const [, lang] = pathname.split("/");
    i18n.changeLanguage(lang || "en");
  }, [pathname, i18n]);

  return (
    <ThemeProvider theme={theme[preferredColorScheme]}>
      <Normalize />
      <GlobalStyle />
      <Wrapper>
        <Main>
          <Title>
            <Twemoji emoji="🙏" /> {t("God's Promises")}
          </Title>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path={`/(en|es)/${PROMISE_PATH}/:gPromiseId`}>
            <GPromise />
          </Route>
        </Main>
        <Footer>
          <LanguageSelector />
        </Footer>
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
