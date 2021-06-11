import React from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import styled from "styled-components";
import { GPromise as GPromiseType } from "../../types";
import { langs } from "../i18next";
import ContentLoader from "../loaders/ContentLoader";
import Twemoji from "../twemoji/Twemoji";

const Figure = styled.figure`
  margin: 0;
  background-color: #f0f0f0;
  font-family: "Quattrocento", serif;
  border-radius: 0.5rem;
  padding: 1.25em;
  width: clamp(320px, 90vw, 520px);
`;

const Blockquote = styled.blockquote`
  color: #000;
  line-height: 1.25em;
  font-size: 1.25rem;
`;

const Figcaption = styled.figcaption`
  margin-top: 1em;
  text-align: right;
  &::before {
    content: "—";
    margin-right: 0.25em;
  }
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

type GPromiseProps = {
  gPromise: GPromiseType;
  isLoading: boolean;
};

export default function GPromiseContainer({
  gPromise,
  isLoading,
}: GPromiseProps) {
  const { t, i18n } = useTranslation();
  const { bibleId } = langs[i18n.language];
  const queryClient = useQueryClient();

  const onRefreshButtonClick = () => {
    queryClient.invalidateQueries("randomGPromise");
  };

  return (
    <article>
      <Figure>
        {isLoading ? (
          <ContentLoader />
        ) : (
          <>
            <Blockquote>{gPromise.content[bibleId]?.text}</Blockquote>
            <Figcaption>{gPromise.content[bibleId]?.reference}</Figcaption>
          </>
        )}
      </Figure>
      <Footer>
        <ButtonsWrapper>
          <Button onClick={onRefreshButtonClick}>
            <Twemoji emoji="⏩" /> {t("next")}
          </Button>
        </ButtonsWrapper>
      </Footer>
    </article>
  );
}
