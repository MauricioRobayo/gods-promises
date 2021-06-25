import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Redirect, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import styled, { ThemeProvider } from "styled-components/macro";
import { Normalize } from "styled-normalize";
import { PROMISE_PATH } from "./config";
import GPromise from "./features/gPromises/GPromise";
import { Home } from "./features/home";
import { DEFAULT_LANG, supportedLngs } from "./features/i18next";
import { Navbar } from "./features/Navbar";
import { Twemoji } from "./features/twemoji";
import usePreferredColorScheme from "./hooks/usePreferredColorScheme";
import { GlobalStyle, theme } from "./styles";

const cssTransitionClassNamesPrefix = "page";
const cssTransitionTimeout = 800;

const basePath = `/(${supportedLngs.join("|")})`;

const paths = [
  { path: basePath, Component: Home },
  { path: `${basePath}/${PROMISE_PATH}/:gPromiseId`, Component: GPromise },
];

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
`;

const StyledNavbar = styled(Navbar)`
  margin-bottom: 2rem;
`;

const Main = styled.main`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  place-items: center;
  margin: 0 0 20vh 0;
  overflow: hidden;
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-row: 1/2;
  grid-column: 1/2;
  &.${cssTransitionClassNamesPrefix}-enter {
    opacity: 0;
  }

  &.${cssTransitionClassNamesPrefix}-enter-active {
    opacity: 1;
    transition: opacity ${cssTransitionTimeout}ms;
  }

  &.${cssTransitionClassNamesPrefix}-exit {
    opacity: 1;
  }

  &.${cssTransitionClassNamesPrefix}-exit-active {
    opacity: 0;
    transition: opacity ${cssTransitionTimeout}ms;
  }
`;

const Footer = styled.footer`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1rem 0;
  a {
    color: ${({ theme }) => theme.color.text1};
  }
`;

function App() {
  const { t, i18n } = useTranslation();
  const preferredColorScheme = usePreferredColorScheme();

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
          {paths.map(({ path, Component }) => (
            <Route key={path} path={path} exact>
              {({ match }) => (
                <CSSTransition
                  in={match != null}
                  timeout={cssTransitionTimeout}
                  classNames={cssTransitionClassNamesPrefix}
                  unmountOnExit
                >
                  <Page>
                    <Component />
                  </Page>
                </CSSTransition>
              )}
            </Route>
          ))}
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
