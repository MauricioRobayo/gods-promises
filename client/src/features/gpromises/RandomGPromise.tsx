import React from "react";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import GPromise from "./GPromise";

const RandomGPromise = () => {
  const { isLoading, isError, data } = useRandomGPromise();

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  return <GPromise promise={data!} isLoading={isLoading} />;
};
export default RandomGPromise;
