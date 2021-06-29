import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { PROMISE_PATH } from "../../config";
import useGPromise from "../../hooks/useGPromise";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import { lngs } from "../i18next";
import { AppLoader } from "../loaders";
import Twemoji from "../twemoji/Twemoji";
import { createTweet } from "./utils";
import {
  cssTransitionClassNamesPrefix,
  cssTransitionTimeout,
  Article,
  Header,
  Title,
  Subtitle,
  BlockquoteWrapper,
  Blockquote,
  Footer,
  ButtonsWrapper,
  ShareButton,
  ShareIcon,
  ForwardIcon,
} from "./styles";

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
  const title = `${reference} | ${t("God's Promises")}`;

  const tweet = createTweet({
    text,
    reference,
    link: `https://godspromises.bible${location.pathname}`,
  });

  const share = () => {
    navigator.share({
      title,
      text: createTweet({
        text,
        reference,
      }),
      url: `https://godspromises.bible${location.pathname}`,
    });
  };

  const shareButton =
    "share" in navigator ? (
      <ShareButton type="button" onClick={share} title={t("Share")}>
        <ShareIcon />
      </ShareButton>
    ) : (
      <a title="tweet" href={`https://twitter.com/intent/tweet?text=${tweet}`}>
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
            <title>{title}</title>
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
                <Link to={goToNextPromise} title={t("Next")}>
                  <ForwardIcon />
                </Link>
              )}
            </ButtonsWrapper>
          </Footer>
        </Article>
      </CSSTransition>
    </SwitchTransition>
  );
}
