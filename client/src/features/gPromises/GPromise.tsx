import React from "react";
import { useParams } from "react-router";
import useGPromise from "../../hooks/useGPromise";
import GPromiseContainer from "./GPromiseContainer";

export default function GPromise() {
  const { gPromiseId } = useParams<{ gPromiseId: string }>();
  const { isLoading, isError, data } = useGPromise(gPromiseId);

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  return <GPromiseContainer gPromise={data!} isLoading={isLoading} />;
}
