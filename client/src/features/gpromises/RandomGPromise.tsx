import React from "react";
import useRandomGPromise from "../../hooks/useRandomGPromise";
import GPromise from "./GPromise";

export default function RandomGPromise() {
  const { isLoading, isError, data } = useRandomGPromise();

  console.log(`😀`, data);

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  return <GPromise gPromise={data!} isLoading={isLoading} />;
}
