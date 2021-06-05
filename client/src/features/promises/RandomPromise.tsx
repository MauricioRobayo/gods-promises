import React from "react";
import useRandomPromise from "../../hooks/useRandomPromise";
import Promise from "./Promise";

const RandomPromise = () => {
  const { isLoading, isError, data } = useRandomPromise();

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  return <Promise promise={data} isLoading={isLoading} />;
};
export default RandomPromise;
