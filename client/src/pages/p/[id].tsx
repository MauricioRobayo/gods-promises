import { GPromiseDTO } from "@mauriciorobayo/gods-promises/lib/models";
import axios from "axios";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import { AppLoader } from "../../components/Loader";
import { localeInfo } from "../../config";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import {
  Article,
  Blockquote,
  BlockquoteWrapper,
  ButtonsWrapper,
  Footer,
  ForwardIcon,
  Header,
  ShareButton,
  ShareIcon,
  Subtitle,
  Title,
  TwitterIcon,
} from "./styles";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { params } = context;
  if (typeof params?.id !== "string") {
    throw new Error();
  }
  const { data } = await axios.post<{ result: GPromiseDTO }>(
    "http://127.0.0.1:5001/promises-edfea/us-central1/promise",
    {
      data: params.id,
    }
  );
  return {
    props: {
      gPromise: data.result,
    },
  };
};

export default function GPromise({
  gPromise,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("common");
  const router = useRouter();

  const locale = router.locale as string;
  const gPromiseId = router.query.id as string;

  const { bibleId } = localeInfo[locale];
  const randomGPromiseQuery = useRandomGPromise();
  const queryClient = useQueryClient();

  useEffect(() => {
    // TODO: #76 promise Id is the same as the current page
    queryClient.refetchQueries("randomGPromise");
  }, [queryClient]);

  const baseUrl = "https://godspromises.bible";
  const { text, reference, bibleName } = gPromise.content[bibleId];
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

  const hasShare = typeof navigator !== "undefined" && "share" in navigator;

  const shareButton = hasShare ? (
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
