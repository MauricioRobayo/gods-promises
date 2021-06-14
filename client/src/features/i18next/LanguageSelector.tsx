import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { langs } from "./";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`;

type LanguageSelectorProps = {
  className?: string;
};

export const LanguageSelector = ({ className = "" }: LanguageSelectorProps) => {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  return (
    <Wrapper className={className}>
      {Object.keys(langs).map((lang) => {
        if (i18n.language === lang) {
          return <span key={lang}>{langs[lang].nativeName}</span>;
        }

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
