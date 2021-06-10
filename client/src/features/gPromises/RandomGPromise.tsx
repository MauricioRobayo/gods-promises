import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import GPromiseContainer from "./GPromiseContainer";

export default function RandomGPromise() {
  const history = useHistory();
  const { i18n } = useTranslation();
  const { isLoading, isError, data } = useRandomGPromise();
  console.log("😀", { data });

  useEffect(() => {
    if (isLoading || isError) {
      return;
    }
    history.push(`/${i18n.language}/p/${data.id}`);
  }, [data, isLoading, isError, i18n, history]);

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  if (isLoading) {
    return <div>Loading random promise...</div>;
  }

  return <GPromiseContainer gPromise={data!} isLoading={isLoading} />;
}
