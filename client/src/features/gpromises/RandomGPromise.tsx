import React from "react";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import GPromiseContainer from "./GPromiseContainer";

export default function RandomGPromise() {
  const { isLoading, isError, data } = useRandomGPromise();

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  return <GPromiseContainer gPromise={data!} isLoading={isLoading} />;
}
