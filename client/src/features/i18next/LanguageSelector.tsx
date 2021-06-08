import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

const Wrapper = styled.div`
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

const LanguageSelector = () => {
  const { pathname } = useLocation();
  return (
    <Wrapper>
      {Object.keys(langs).map((lang) => {
        const [, , ...path] = pathname.split("/");
        return (
          <Link key={lang} to={`/${lang}/${path.join("/")}`}>
            {langs[lang].nativeName}
          </Link>
        );
      })}
    </Wrapper>
  );
};
export default LanguageSelector;
