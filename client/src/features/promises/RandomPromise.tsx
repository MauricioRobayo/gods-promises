import React from "react";
import useRandomPromise from "../../hooks/useRandomPromise";
import Promise from "./Promise";

const RandomPromise = () => {
  const { isLoading, data } = useRandomPromise();
  return <Promise promise={data} isLoading={isLoading} />;
};
export default RandomPromise;
