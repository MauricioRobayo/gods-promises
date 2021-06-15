import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { LanguageSelector } from "../i18next";
import { Twemoji } from "../twemoji";

const Title = styled.h1`
  font-size: 1.75rem;
  @media ${({ theme }) => theme.device.medium} {
    font-size: 2rem;
  }
  margin: 2em 0 2em;
  font-weight: 900;
`;

function Navbar() {
  const { t } = useTranslation();
  return (
    <nav>
      <Title>
        <Twemoji emoji="🙏" /> {t("God's Promises")}
      </Title>

      <LanguageSelector />
    </nav>
  );
}

export default Navbar;
