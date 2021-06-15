import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { lngs } from "./";

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
      {Object.keys(lngs).map((lang) => {
        if (i18n.language === lang) {
          return <span key={lang}>{lngs[lang].nativeName}</span>;
        }

        const [, , ...path] = pathname.split("/");
        return (
          <Link key={lang} to={`/${lang}/${path.join("/")}`}>
            {lngs[lang].nativeName}
          </Link>
        );
      })}
    </Wrapper>
  );
};
