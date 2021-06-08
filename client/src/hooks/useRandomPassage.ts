import { useQuery, UseQueryOptions } from "react-query";
import { createFunction } from "../features/firebase";

type UseRandomPassageOptions = Pick<
  UseQueryOptions,
  | "refetchOnMount"
  | "refetchOnWindowFocus"
  | "refetchOnReconnect"
  | "cacheTime"
  | "staleTime"
>;

const useRandomPassage = ({
  refetchOnMount = false,
  refetchOnWindowFocus = false,
  refetchOnReconnect = false,
  cacheTime = 60 * 60 * 1000,
  staleTime = 60 * 60 * 1000,
}: UseRandomPassageOptions = {}) => {
  const randomGPromise =
    createFunction<
      string,
      {
        reference: string;
        text: string;
        source: string;
      }
    >("randomGPromise");

  const getRandomGPromise = () => randomGPromise("kjv");

  return useQuery("randomGPromise", getRandomGPromise, {
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect,
    cacheTime,
    staleTime,
    retry: false,
  });
};

export default useRandomPassage;
