import { useQuery, UseQueryOptions } from "react-query";
import { firebaseCallable } from "../features/firebase";
import { BibleId } from "../types";

type UseRandomGPromiseOptions = Pick<
  UseQueryOptions,
  | "refetchOnMount"
  | "refetchOnWindowFocus"
  | "refetchOnReconnect"
  | "cacheTime"
  | "staleTime"
>;

const useRandomGPromise = ({
  refetchOnMount = false,
  refetchOnWindowFocus = false,
  refetchOnReconnect = false,
  cacheTime = 60 * 60 * 1000,
  staleTime = 60 * 60 * 1000,
}: UseRandomGPromiseOptions = {}) => {
  const randomGPromise = firebaseCallable<
    {
      reference: string;
      text: string;
      source: string;
    },
    BibleId
  >("randomGPromise", "kjv");

  return useQuery("randomGPromise", randomGPromise, {
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect,
    cacheTime,
    staleTime,
    retry: false,
  });
};

export default useRandomGPromise;
