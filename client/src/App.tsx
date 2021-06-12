import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components/macro";
import GPromise from "./features/gPromises/GPromise";
import { selectCurrentGPromise } from "./features/gPromises/gPromisesSlice";
import { Home } from "./features/home";
import { LanguageSelector } from "./features/i18next";
import Twemoji from "./features/twemoji/Twemoji";
import usePreferredColorScheme from "./hooks/usePreferredColorScheme";
import { theme } from "./styles";
import { GlobalStyle } from "./styles";
import { Normalize } from "styled-normalize";
import { ThemeProvider } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  @media ${({ theme }) => theme.device.medium} {
    font-size: 2rem;
  }
  margin: 2em 0 1em;
  font-weight: 900;
  color: ${({ theme }) => theme.color.text1};
`;

const Footer = styled.footer`
  color: ${({ theme }) => theme.color.text2};
  flex: 1;
  align-items: flex-end;
  display: flex;
  justify-content: center;
  padding: 1rem 0;
`;

function App() {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const currentGPromise = useSelector(selectCurrentGPromise);
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
          {currentGPromise ? <GPromise gPromise={currentGPromise} /> : <Home />}
        </Main>
        <Footer>
          <LanguageSelector />
        </Footer>
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
