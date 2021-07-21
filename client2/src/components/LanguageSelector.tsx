import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { lngs, DEFAULT_LANG } from "../services/i18next/config";

const Select = styled.select`
  border: none;
  padding: 0.25em;
  background-color: ${({ theme }) => theme.color.surface2};
  color: ${({ theme }) => theme.color.text1};
  border-radius: 4px;
`;

type LanguageSelectorProps = {
  className?: string;
};

export const LanguageSelector = ({ className = "" }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const { push } = useHistory();
  const { pathname } = useLocation();
  const [value, setValue] = useState(i18n.language || DEFAULT_LANG);

  const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    const [, , ...currentPath] = pathname.split("/");
    const newPath = ["", newLang, ...currentPath].join("/");
    setValue(newLang);
    i18n.changeLanguage(newLang);
    push(newPath);
  };

  return (
    <Select className={className} value={value} onChange={onChangeHandler}>
      {Object.keys(lngs).map((lang) => {
        if (i18n.language === lang) {
          return (
            <option key={lang} value={lang}>
              {lngs[lang].nativeName}
            </option>
          );
        }

        return (
          <option key={lang} value={lang}>
            {lngs[lang].nativeName}
          </option>
        );
      })}
    </Select>
  );
};
