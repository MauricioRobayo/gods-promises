import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { FaShareAltSquare } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import styled from "styled-components/macro";
import { PROMISE_PATH } from "../../config";
import useGPromise from "../../hooks/useGPromise";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import { lngs } from "../i18next";
import { AppLoader } from "../loaders";
import Twemoji from "../twemoji/Twemoji";
import { createTweet } from "./utils";

const cssTransitionClassNamesPrefix = "passage-";
const cssTransitionTimeout = 300;

const Article = styled.article`
  width: 90vw;
  max-width: ${({ theme }) => theme.size.medium};
  &.${cssTransitionClassNamesPrefix}-exit {
    opacity: 0;
    transform: translateX(-500px);
    transition: opacity ${cssTransitionTimeout}ms ease-in,
      transform ${cssTransitionTimeout}ms ease-in;
  }
  &.${cssTransitionClassNamesPrefix}-enter {
    opacity: 0;
    transform: translateX(500px);
  }
  &.${cssTransitionClassNamesPrefix}-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity ${cssTransitionTimeout}ms ease-out,
      transform ${cssTransitionTimeout}ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
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
  &::before,
  &::after {
    opacity: 0.5;
    font-size: 1.15em;
  }
  &::before {
    content: "“";
    margin-right: 0.05em;
  }
  &::after {
    content: "”";
    margin-left: 0.05em;
  }
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
  & > * {
    &:not(:last-child) {
      margin-right: 1em;
    }
    & > *:not(:last-child) {
      margin-right: 0.5em;
    }
  }
`;

const ShareButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.color.brand};
`;

const ShareIcon = styled(FaShareAltSquare)`
  color: ${({ theme }) => theme.color.brand};
  margin-left: 0.5em;
`;

export default function GPromiseContainer() {
  const { t, i18n } = useTranslation();
  const { bibleId } = lngs[i18n.language];
  const { gPromiseId } = useParams<{ gPromiseId: string }>();
  const gPromiseQuery = useGPromise(gPromiseId);
  const randomGPromiseQuery = useRandomGPromise();
  const queryClient = useQueryClient();
  const location = useLocation();

  useEffect(() => {
    queryClient.refetchQueries("randomGPromise");
  }, [queryClient]);

  const goToNextPromise = () => {
    if (!randomGPromiseQuery.data) {
      return location.pathname;
    }

    if (gPromiseId === randomGPromiseQuery.data.id) {
      queryClient.refetchQueries("randomGPromise");
    }

    return `/${i18n.language}/${PROMISE_PATH}/${randomGPromiseQuery.data.id}`;
  };

  if (gPromiseQuery.isLoading || gPromiseQuery.isIdle) {
    return <AppLoader />;
  }

  if (gPromiseQuery.isError || randomGPromiseQuery.isError) {
    return <div>{t("Something unexpected happened!")}</div>;
  }

  const { text, reference, bibleName } = gPromiseQuery.data.content[bibleId];
  const tweet = createTweet({
    text,
    reference,
    link: `https://godspromises.bible${location.pathname}`,
  });

  const share = () => {
    navigator.share({
      title: "",
      text: createTweet({
        text,
        reference,
      }),
      url: `https://godspromises.bible${location.pathname}`,
    });
  };

  const shareButton =
    "share" in navigator ? (
      <ShareButton type="button" onClick={share}>
        {t("Share")}
        <ShareIcon />
      </ShareButton>
    ) : (
      <a href={`https://twitter.com/intent/tweet?text=${tweet}`}>
        <span>{t("Tweet")}</span>
        <Twemoji emoji="📣" />
      </a>
    );

  return (
    <SwitchTransition>
      <CSSTransition
        key={text}
        classNames={cssTransitionClassNamesPrefix}
        timeout={cssTransitionTimeout}
      >
        <Article>
          <Helmet>
            <title>{`${reference} | ${t("God's Promises")}`}</title>
            <meta name="description" content={text} />
          </Helmet>
          <Header>
            <Title>{reference}</Title>
            <Subtitle>{bibleName}</Subtitle>
          </Header>
          <BlockquoteWrapper>
            <Blockquote>{text}</Blockquote>
          </BlockquoteWrapper>
          <Footer>
            <ButtonsWrapper>
              {shareButton}
              {randomGPromiseQuery.isFetching ? (
                <AppLoader size={8} />
              ) : (
                <Link to={goToNextPromise}>
                  <span>{t("next")}</span>
                  <Twemoji emoji="⏩" />
                </Link>
              )}
            </ButtonsWrapper>
          </Footer>
        </Article>
      </CSSTransition>
    </SwitchTransition>
  );
}
