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
import { mediumSize } from "./styles";

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
  @media (min-width: ${mediumSize}) {
    font-size: 2rem;
  }
  margin: 2em 0 1em;
  font-weight: 900;
`;

const StyledLanguageSelector = styled(LanguageSelector)`
  flex: 1;
  align-items: flex-end;
`;

function App() {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const currentGPromise = useSelector(selectCurrentGPromise);

  useEffect(() => {
    const [, lang] = pathname.split("/");
    i18n.changeLanguage(lang || "en");
  }, [pathname, i18n]);

  return (
    <Wrapper>
      <Main>
        <Title>
          <Twemoji emoji="🙏" /> {t("God's Promises")}
        </Title>
        {currentGPromise ? <GPromise gPromise={currentGPromise} /> : <Home />}
      </Main>
      <StyledLanguageSelector />
    </Wrapper>
  );
}

export default App;
