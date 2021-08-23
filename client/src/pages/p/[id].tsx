import { GPromiseDTO } from "@mauriciorobayo/gods-promises/lib/models";
import axios from "axios";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import { AppLoader } from "../../components/Loader";
import { localeInfo } from "../../config";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import { GPromise } from "../../components/GPromise";
import { FaForward, FaShareAlt, FaTwitter } from "react-icons/fa";
import styled, { css } from "styled-components";

export const ShareButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.color.brand};
  cursor: pointer;
`;

const iconStyle = css``;

export const TwitterIcon = styled(FaTwitter)`
  ${iconStyle}
`;

export const ShareIcon = styled(FaShareAlt)`
  ${iconStyle}
`;

export const ForwardIcon = styled(FaForward)`
  ${iconStyle}
`;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { params } = context;
  if (typeof params?.id !== "string") {
    throw new Error(`id must be of type string`);
  }

  try {
    const { data } = await axios.post<{ result: GPromiseDTO }>(
      "https://us-central1-promises-edfea.cloudfunctions.net/random",
      {
        data: params.id,
      }
    );
    return {
      props: {
        gPromise: data.result,
      },
    };
  } catch (err) {
    context.res.statusCode = 404;
    if (err.response?.status === 404) {
      return {
        props: {
          gPromise: null,
        },
      };
    }
    throw new Error(err);
  }
};

export default function GPromisePage({
  gPromise,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const randomGPromiseQuery = useRandomGPromise();
  const { t } = useTranslation("common");
  const { t: tError } = useTranslation("error");
  const router = useRouter();
  const queryClient = useQueryClient();

  const locale = router.locale as string;
  const { bibleId } = localeInfo[locale];
  const baseUrl = "https://godspromises.bible";

  useEffect(() => {
    if (!gPromise) {
      return;
    }

    if (gPromise.id === randomGPromiseQuery?.data?.id) {
      queryClient.refetchQueries("randomGPromise");
    }
  }, [queryClient, randomGPromiseQuery, gPromise]);

  const nextButton =
    randomGPromiseQuery.isLoading ||
    randomGPromiseQuery.isFetching ||
    randomGPromiseQuery.isIdle ? (
      <AppLoader size={8} />
    ) : randomGPromiseQuery.isError ? (
      <div>{tError("generic error")}</div>
    ) : (
      <Link href={`/p/${randomGPromiseQuery.data.id}`}>
        <a>
          <ForwardIcon />
        </a>
      </Link>
    );

  if (!gPromise) {
    return (
      <>
        <GPromise
          title="404"
          subtitle="¯\_(ツ)_/¯"
          text={tError("promise not found")}
          buttons={[nextButton]}
        />
      </>
    );
  }

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
    <>
      <NextSeo
        title={`${reference} | ${t("God's Promises")}`}
        description={text}
        openGraph={{
          title: `${reference} | ${t("God's Promises")}`,
          description: text,
        }}
      />
      <GPromise
        title={reference}
        subtitle={bibleName}
        text={text}
        buttons={[shareButton, nextButton]}
      />
    </>
  );
}
