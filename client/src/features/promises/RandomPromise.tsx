import React from "react";
import useRandomPromise from "../../hooks/useRandomPromise";
import Promise from "./Promise";

const RandomPromise = () => {
  const { isLoading, data } = useRandomPromise();

  if (isLoading) {
    return <div>Loading random promise...</div>;
  }

  return <Promise promise={data} />;
};
export default RandomPromise;
