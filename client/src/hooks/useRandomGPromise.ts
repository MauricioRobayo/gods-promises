import { useQuery, UseQueryOptions } from "react-query";
import { firebaseCallable } from "../features/firebase";
import { GPromise, BibleId } from "../types";

type UseRandomGPromiseOptions = { bibleId: BibleId } & Pick<
  UseQueryOptions,
  | "refetchOnMount"
  | "refetchOnWindowFocus"
  | "refetchOnReconnect"
  | "cacheTime"
  | "staleTime"
>;

const useRandomGPromise = ({
  bibleId,
  refetchOnMount = false,
  refetchOnWindowFocus = false,
  refetchOnReconnect = false,
  cacheTime = 60 * 60 * 1000,
  staleTime = 60 * 60 * 1000,
}: UseRandomGPromiseOptions) => {
  const randomGPromise = firebaseCallable<GPromise, BibleId>("randomGPromise");

  return useQuery("randomGPromise", () => randomGPromise(bibleId), {
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect,
    cacheTime,
    staleTime,
    retry: false,
  });
};

export default useRandomGPromise;
