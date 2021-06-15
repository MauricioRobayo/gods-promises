import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { PROMISE_PATH } from "../../config";
import useGPromise from "../../hooks/useGPromise";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import { lngs } from "../i18next";
import { AppLoader } from "../loaders";
import Twemoji from "../twemoji/Twemoji";
import { createTweet } from "./utils";

const Article = styled.article`
  width: 90vw;
  max-width: ${({ theme }) => theme.size.medium};
`;

const Header = styled.div`
  margin: 0 ${({ theme }) => theme.space.side.small} 1rem;
  @media (min-width: ${({ theme }) => theme.size.small}) {
    margin: 0 ${({ theme }) => theme.space.side.medium} 1rem;
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
  padding: ${({ theme }) => theme.space.side.small};
  @media (min-width: ${({ theme }) => theme.size.small}) {
    padding: ${({ theme }) => theme.space.side.medium};
  }
`;

const Blockquote = styled.blockquote`
  color: ${({ theme }) => theme.color.text1};
  line-height: 1.5em;
  font-size: 1.25rem;
`;

const Footer = styled.footer`
  font-size: ${({ theme }) => theme.font.size.small};
  margin: 1em ${({ theme }) => theme.space.side.small} 0;
  @media (min-width: ${({ theme }) => theme.size.small}) {
    margin: 1rem ${({ theme }) => theme.space.side.medium} 0;
  }
  display: flex;
  justify-content: flex-end;
  a {
    text-decoration: none;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  & > a {
    &:not(:last-child) {
      margin-right: 1em;
    }
    & > *:not(:last-child) {
      margin-right: 0.5em;
    }
  }
`;

export default function GPromiseContainer() {
  const { t, i18n } = useTranslation();
  const { bibleId } = lngs[i18n.language];
  const { gPromiseId } = useParams<{ gPromiseId: string }>();
  const { isError: isErrorGPromise, data: gPromise } = useGPromise(gPromiseId);
  const {
    isFetching: isFetchingRandomGPromise,
    isError: isErrorRandomGPromise,
    data: randomGPromise,
  } = useRandomGPromise();
  const queryClient = useQueryClient();
  const location = useLocation();

  useEffect(() => {
    queryClient.refetchQueries("randomGPromise");
  }, [queryClient]);

  const goToNextPromise = () => {
    if (!randomGPromise) {
      return location.pathname;
    }

    if (gPromiseId === randomGPromise.id) {
      queryClient.refetchQueries("randomGPromise");
    }

    return `/${i18n.language}/${PROMISE_PATH}/${randomGPromise.id}`;
  };

  if (isErrorGPromise || isErrorRandomGPromise || !gPromise) {
    return <div>{t("Something unexpected happened!")}</div>;
  }

  const { text, reference, bibleName } = gPromise.content[bibleId];
  const tweet = createTweet({
    text,
    reference,
    link: `https://godspromises.bible${location.pathname}`,
  });
  return (
    <Article>
      <Header>
        <Title>{reference}</Title>
        <Subtitle>{bibleName}</Subtitle>
      </Header>
      <BlockquoteWrapper>
        <Blockquote>{text}</Blockquote>
      </BlockquoteWrapper>
      <Footer>
        {isFetchingRandomGPromise ? (
          <AppLoader size={8} />
        ) : (
          <ButtonsWrapper>
            <a href={`https://twitter.com/intent/tweet?text=${tweet}`}>
              <span>{t("Tweet")}</span>
              <Twemoji emoji="📣" />
            </a>
            <Link to={goToNextPromise}>
              <span>{t("next")}</span>
              <Twemoji emoji="⏩" />
            </Link>
          </ButtonsWrapper>
        )}
      </Footer>
    </Article>
  );
}
