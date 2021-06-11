import Twemoji from "./features/twemoji/Twemoji";
import styled from "styled-components/macro";
import { useTranslation } from "react-i18next";
import { useLocation, Switch, Route, Redirect } from "react-router-dom";
import { useEffect } from "react";
import { LanguageSelector } from "./features/i18next";
import GPromise from "./features/gPromises/GPromise";
import { Home } from "./features/home";
import { useQueryClient } from "react-query";

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin: 2rem 0;
  font-weight: 900;
`;

const Footer = styled.footer`
  font-size: 0.85rem;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  a {
    text-decoration: none;
  }
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  cursor: pointer;
`;

const ButtonsWrapper = styled.div`
  & > button:not(:last-child) {
    margin-right: 1rem;
  }
`;

const base = "/:lang(en|es)";

function App() {
  const queryClient = useQueryClient();
  const onRefreshButtonClick = () => {
    queryClient.invalidateQueries("randomGPromise");
  };
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const [, lang] = pathname.split("/");
    i18n.changeLanguage(lang || "en");
  }, [pathname, i18n]);

  return (
    <>
      <Main>
        <Title>
          <Twemoji emoji="🙏" /> {t("God's Promises")}
        </Title>
        <Switch>
          <Route path={`${base}/p/:gPromiseId`}>
            <GPromise />
          </Route>
          <Route path={base}>
            <Home />
          </Route>
          <Redirect path="/p/:gPromiseId" to="/en/p/:gPromiseId" />
          <Redirect path="/" to="/en" />
        </Switch>
        <Footer>
          <ButtonsWrapper>
            <Button onClick={onRefreshButtonClick}>
              <Twemoji emoji="⏩" /> {t("next")}
            </Button>
          </ButtonsWrapper>
        </Footer>
      </Main>
      <LanguageSelector />
    </>
  );
}

export default App;
