import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, useLocation } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components/macro";
import { Normalize } from "styled-normalize";
import { PROMISE_PATH } from "./config";
import GPromise from "./features/gPromises/GPromise";
import { Home } from "./features/home";
import { DEFAULT_LANG, supportedLngs } from "./features/i18next";
import { Navbar } from "./features/Navbar";
import usePreferredColorScheme from "./hooks/usePreferredColorScheme";
import { GlobalStyle, theme } from "./styles";
import { Helmet } from "react-helmet";
import { Twemoji } from "./features/twemoji";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const StyledNavbar = styled(Navbar)`
  margin-bottom: 2rem;
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
  a {
    color: ${({ theme }) => theme.color.text1};
  }
`;

const basePath = `/(${supportedLngs.join("|")})`;

function App() {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
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
        <Helmet>
          <html lang={i18n.language} />
          <title>{t("God's Promises")}</title>
          <meta
            name="description"
            content={t(
              "If you need wisdom, ask our generous God, and he will give it to you. He will not rebuke you for asking."
            )}
          />
        </Helmet>
        <StyledNavbar />
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
        <Footer>
          <a href="https://godspromises.bible">
            <Twemoji emoji="🙏" /> {t("God's Promises")}
          </a>
        </Footer>
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
