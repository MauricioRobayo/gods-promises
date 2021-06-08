import React from "react";
import useRandomPassage from "../../hooks/useRandomPassage";
import GPromise from "./GPromise";

const RandomGPromise = () => {
  const { isLoading, isError, data } = useRandomPassage();

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  return <GPromise promise={data} isLoading={isLoading} />;
};
export default RandomGPromise;
