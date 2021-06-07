import React from "react";
import useRandomPassage from "../../hooks/useRandomPassage";
import Passage from "./Passage";

const RandomPassage = () => {
  const { isLoading, isError, data } = useRandomPassage();

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  return <Passage promise={data} isLoading={isLoading} />;
};
export default RandomPassage;
