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
import React, { useEffect } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useQueryClient } from "react-query";
import axios from "axios";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (typeof params?.id !== "string") {
    throw new Error();
  }
  const { data } = await axios.post(
    "http://127.0.0.1:5001/promises-edfea/us-central1/promise",
    {
      data: params.id,
    }
  );
  return {
    props: {
      data: data.result,
    },
  };
};

export default function GPromise({
  data, // TODO: #75 fix type of data
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
  const { text, reference, bibleName } = data.content[bibleId];
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
