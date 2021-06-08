import React from "react";
import { useTranslation } from "react-i18next";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import { langs } from "../i18next/LanguageSelector";
import GPromise from "./GPromise";

const RandomGPromise = () => {
  const { i18n } = useTranslation();
  const { bibleId } = langs[i18n.language];
  const { isLoading, isError, data } = useRandomGPromise({ bibleId });

  console.log({ bibleId });

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  return <GPromise gPromise={data!} isLoading={isLoading} />;
};
export default RandomGPromise;
