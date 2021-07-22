import useGPromise from "../../hooks/useGPromise";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import { AppLoader } from "../../components/Loader";
import Link from "next/link";
import {
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
  TwitterIcon,
} from "./styles";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { localeInfo } from "../../config";
import { useQueryClient } from "react-query";
import React, { useEffect } from "react";

export default function GPromise() {
  const { t } = useTranslation("common");
  const router = useRouter();

  const locale = router.locale as string;
  const gPromiseId = router.query.id as string;

  const { bibleId } = localeInfo[locale];
  const gPromiseQuery = useGPromise(gPromiseId);
  const randomGPromiseQuery = useRandomGPromise();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.refetchQueries("randomGPromise");
  }, [queryClient]);

  if (gPromiseQuery.isLoading || gPromiseQuery.isIdle) {
    return <AppLoader />;
  }

  if (gPromiseQuery.isError || randomGPromiseQuery.isError) {
    return <div>{t("Something unexpected happened!")}</div>;
  }

  const baseUrl = "https://godspromises.bible";
  const { text, reference, bibleName } = gPromiseQuery.data.content[bibleId];
  const title = `${reference} | ${t("God's Promises")}`;
  const description = `${text} ${reference}`;
  const link = `${baseUrl}${router.asPath}`;

  const share = () => {
    navigator.share({
      title,
      text,
      url: link,
    });
  };

  const shareButton =
    "share" in navigator ? (
      <ShareButton type="button" onClick={share} title={t("Share")}>
        <ShareIcon />
      </ShareButton>
    ) : (
      <a
        title="Tweet"
        href={`https://twitter.com/intent/tweet?text=${description} ${link}`}
      >
        <TwitterIcon />
      </a>
    );

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
        <ButtonsWrapper>
          {shareButton}
          {randomGPromiseQuery.isFetching ? (
            <AppLoader size={8} />
          ) : (
            <Link href={`/p/${gPromiseId}`}>
              <a>
                <ForwardIcon />
              </a>
            </Link>
          )}
        </ButtonsWrapper>
      </Footer>
    </Article>
  );
}
