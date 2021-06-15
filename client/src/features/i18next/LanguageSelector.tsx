import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { lngs, DEFAULT_LANG } from "./config";

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
  const [value, setValue] = useState(DEFAULT_LANG);
  const { i18n } = useTranslation();

  const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
    setValue(e.target.value);
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
