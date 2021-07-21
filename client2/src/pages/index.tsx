import Head from "next/head";

import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";
import styled, { ThemeProvider } from "styled-components/macro";
import { PROMISE_PATH } from "../../config";
import GPromise from "../src/components/gPromises/GPromise";
import { Home } from "../components/Home";
import { DEFAULT_LANG, supportedLngs } from "../src/components/i18next";
import { Navbar } from "../components/Navbar";
import { Twemoji } from "../components/Twemoji";

const cssTransitionClassNamesPrefix = "page";
const cssTransitionTimeout = 800;

const basePath = `/(${supportedLngs.join("|")})`;

// const paths = [
//   { path: basePath, Component: Home },
//   { path: `${basePath}/${PROMISE_PATH}/:gPromiseId`, Component: GPromise },
// ];

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
`;

const StyledNavbar = styled(Navbar)`
  margin-bottom: 2rem;
  position: relative;
  z-index: 0;
`;

const Main = styled.main`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  place-items: center;
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
    color: ${({ theme }) => theme.color.text2};
  }
`;

function App() {
  const { t, i18n } = useTranslation();

  return (
    <Wrapper>
      <StyledNavbar />
      <Main>
        <CSSTransition
          in={true}
          timeout={cssTransitionTimeout}
          classNames={cssTransitionClassNamesPrefix}
          unmountOnExit
        >
          <Page>
            <Home />
          </Page>
        </CSSTransition>
        {/* <Redirect to={`/${DEFAULT_LANG}`} /> */}
      </Main>
      <Footer>
        <a href="https://godspromises.bible">
          <Twemoji emoji="🙏" /> {t("God's Promises")}
        </a>
      </Footer>
    </Wrapper>
  );
}

export default App;
