import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import { langs } from "../i18next";
import Loader from "../loaders/Loader";
import Twemoji from "../twemoji/Twemoji";
import {
  GPromise as GPromiseType,
  selectNextGPromise,
  setCurrentGPromise,
  setNextGPromise,
} from "./gPromisesSlice";
import { formatPassage } from "./utils";

const mediumSidesSpace = "1.25em";
const smallSidesSpace = "1em";

const Article = styled.article`
  width: ${({ theme }) =>
    `clamp(${theme.size.small}, 90vw, ${theme.size.medium})`};
`;

const Header = styled.div`
  margin: 0 ${smallSidesSpace} 1rem;
  @media (min-width: ${({ theme }) => theme.size.small}) {
    margin: 0 ${mediumSidesSpace} 1rem;
  }
  @media (min-width: ${({ theme }) => theme.size.medium}) {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.family.secondary};
  font-size: ${({ theme }) => theme.font.size.large};
  font-style: italic;
`;

const Subtitle = styled.div`
  color: ${({ theme }) => theme.color.text2};
  font-size: ${({ theme }) => theme.font.size.small};
`;

const BlockquoteWrapper = styled.section`
  margin: 0;
  background-color: ${({ theme }) => theme.color.surface3};
  font-family: ${({ theme }) => theme.font.family.secondary};
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px 0 ${({ theme }) => theme.color.surfaceShadow2};
  padding: ${smallSidesSpace};
  @media (min-width: ${({ theme }) => theme.size.small}) {
    padding: ${mediumSidesSpace};
  }
`;

const Blockquote = styled.blockquote`
  color: ${({ theme }) => theme.color.text1};
  line-height: 1.25em;
  font-size: 1.25rem;
`;

const Footer = styled.footer`
  font-size: ${({ theme }) => theme.font.size.small};
  margin: 1em ${smallSidesSpace} 0;
  @media (min-width: ${({ theme }) => theme.size.small}) {
    margin: 1rem ${mediumSidesSpace} 0;
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
  align-items: center;
  gap: 0.25em;
  cursor: pointer;
  text-transform: capitalize;
  color: ${({ theme }) => theme.color.brand};
  & > *:not(:last-child) {
    margin-right: 0.25em;
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

  const { text, reference, bibleName } = gPromise.content[bibleId];
  const passage = formatPassage(text);
  return (
    <Article>
      <Header>
        <Title>{reference}</Title>
        <Subtitle>{bibleName}</Subtitle>
      </Header>
      <BlockquoteWrapper>
        <Blockquote>{passage}</Blockquote>
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
