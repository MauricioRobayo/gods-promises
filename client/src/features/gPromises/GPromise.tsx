import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import { langs } from "../i18next";
import Twemoji from "../twemoji/Twemoji";
import {
  BibleId,
  GPromise as GPromiseType,
  selectNextGPromise,
  setCurrentGPromise,
  setNextGPromise,
} from "./gPromisesSlice";

export const bibleName: Record<BibleId, string> = {
  kjv: "Authorized King James Version",
  rvg: "Reina Valera Gómez",
};

const Section = styled.section`
  margin: 0;
  background-color: #f0f0f0;
  font-family: "Cardo", serif;
  border-radius: 0.5rem;
  padding: 1.25em;
  width: clamp(320px, 90vw, 520px);
`;

const Header = styled.div`
  margin: 0.5rem 1rem;
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
`;

const Title = styled.h2`
  font-family: "Cardo", serif;
  font-style: italic;
`;

const Subtitle = styled.div`
  font-size: 0.85rem;
  color: #888;
`;

const Blockquote = styled.blockquote`
  color: #000;
  line-height: 1.25em;
  font-size: 1.25rem;
`;

const Footer = styled.footer`
  font-size: 0.85rem;
  margin: 1rem 1rem 0 0;
  display: flex;
  justify-content: flex-end;
  a {
    text-decoration: none;
  }
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  display: flex;
  align-items: flex-start;
  align-items: center;
  gap: 0.25em;
  cursor: pointer;
  text-transform: capitalize;
`;

const ButtonsWrapper = styled.div`
  & > button:not(:last-child) {
    margin-right: 1rem;
  }
`;

type GPromiseProps = {
  gPromise: GPromiseType;
};

export default function GPromiseContainer({ gPromise }: GPromiseProps) {
  const { t, i18n } = useTranslation();
  const { bibleId } = langs[i18n.language];
  const nextGPromise = useAppSelector(selectNextGPromise);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { data: randomGPromise } = useRandomGPromise();

  useEffect(() => {
    if (!randomGPromise) {
      return;
    }

    dispatch(setNextGPromise(randomGPromise));
  }, [randomGPromise, dispatch]);

  const onNextClickHandler = () => {
    queryClient.refetchQueries("randomGPromise");
    if (!nextGPromise) {
      return;
    }
    dispatch(setCurrentGPromise(nextGPromise));
    dispatch(setNextGPromise(null));
  };

  return (
    <article>
      <Header>
        <Title>{gPromise.content[bibleId]?.reference}</Title>
        <Subtitle>{bibleName[bibleId]}</Subtitle>
      </Header>
      <Section>
        <Blockquote>{gPromise.content[bibleId]?.text}</Blockquote>
      </Section>
      <Footer>
        <ButtonsWrapper>
          <Button onClick={onNextClickHandler}>
            {t("next")} <Twemoji emoji="⏩" />
          </Button>
        </ButtonsWrapper>
      </Footer>
    </article>
  );
}
