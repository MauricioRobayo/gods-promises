import Twemoji from "./features/twemoji/Twemoji";
import styled from "styled-components/macro";
import { useTranslation } from "react-i18next";
import { useLocation, Switch, Route, Redirect } from "react-router-dom";
import { useEffect } from "react";
import { LanguageSelector } from "./features/i18next";
import GPromise from "./features/gPromises/GPromise";
import { Home } from "./features/home";

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

const base = "/:lang(en|es)";

function App() {
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
      </Main>
      <LanguageSelector />
    </>
  );
}

export default App;
