import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import { mediumSize, smallSize } from "../../styles";
import { langs } from "../i18next";
import Loader from "../loaders/Loader";
import Twemoji from "../twemoji/Twemoji";
import {
  GPromise as GPromiseType,
  selectNextGPromise,
  setCurrentGPromise,
  setNextGPromise,
} from "./gPromisesSlice";

const mediumSidesSpace = "1.25em";
const smallSidesSpace = "1em";

const Article = styled.article`
  width: clamp(${smallSize}, 90vw, ${mediumSize});
`;

const Header = styled.div`
  margin: 0.5em ${smallSidesSpace};
  @media (min-width: ${smallSize}) {
    margin: 0.5rem ${mediumSidesSpace};
  }
  @media (min-width: ${mediumSize}) {
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

const BlockquoteWrapper = styled.section`
  margin: 0;
  background-color: #f0f0f0;
  font-family: "Cardo", serif;
  border-radius: 0.5rem;
  padding: ${smallSidesSpace};
  @media (min-width: ${smallSize}) {
    padding: ${mediumSidesSpace};
  }
`;

const Blockquote = styled.blockquote`
  color: #000;
  line-height: 1.25em;
  font-size: 1.25rem;
`;

const Footer = styled.footer`
  font-size: 0.85rem;
  margin: 0.5em ${smallSidesSpace};
  @media (min-width: ${smallSize}) {
    margin: 0.5rem ${mediumSidesSpace};
  }
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
  & > *:not(:last-child) {
    margin-right: 0.05em;
  }
`;

const ButtonsWrapper = styled.div`
  & > button:not(:last-child) {
    margin-right: 1em;
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
  const { isFetching, isError, data: randomGPromise } = useRandomGPromise();

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

  if (isError) {
    return <div>{t("Something unexpected happened!")}</div>;
  }

  return (
    <Article>
      <Header>
        <Title>{gPromise.content[bibleId]?.reference}</Title>
        <Subtitle>{gPromise.content[bibleId]?.bibleName}</Subtitle>
      </Header>
      <BlockquoteWrapper>
        <Blockquote>{gPromise.content[bibleId]?.text}</Blockquote>
      </BlockquoteWrapper>
      <Footer>
        <ButtonsWrapper>
          {isFetching ? (
            <Loader />
          ) : (
            <Button onClick={onNextClickHandler}>
              <span>{t("next")}</span>
              <Twemoji emoji="⏩" />
            </Button>
          )}
        </ButtonsWrapper>
      </Footer>
    </Article>
  );
}
