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
  const randomPromise =
    createFunction<
      string,
      {
        reference: string;
        text: string;
        source: string;
      }
    >("randomPromise");

  const getRandomPromise = () => randomPromise("kjv");

  return useQuery("randomPromise", getRandomPromise, {
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect,
    cacheTime,
    staleTime,
    retry: false,
  });
};

export default useRandomPassage;
