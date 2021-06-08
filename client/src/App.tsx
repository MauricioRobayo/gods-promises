import RandomGPromise from "./features/gpromises/RandomGPromise";
import Twemoji from "./features/twemoji/Twemoji";
import styled from "styled-components/macro";
import { useTranslation } from "react-i18next";

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

const LanguageSelector = styled.div`
  margin: 1rem auto;
  display: flex;
  justify-content: center;
  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`;

const langs: Record<string, { nativeName: string }> = {
  en: { nativeName: "English" },
  es: { nativeName: "Español" },
};

function App() {
  const { t, i18n } = useTranslation();
  console.log(i18n.language);

  return (
    <>
      <Main>
        <Title>
          <Twemoji emoji="🙏" />
          {t("God's Promises")}
        </Title>
        <RandomGPromise />
      </Main>
      <LanguageSelector>
        {Object.keys(langs).map((lang) => (
          <button
            key={lang}
            type="submit"
            disabled={lang === i18n.language}
            onClick={() => i18n.changeLanguage(lang)}
          >
            {langs[lang].nativeName}
          </button>
        ))}
      </LanguageSelector>
    </>
  );
}

export default App;
