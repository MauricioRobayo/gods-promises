import { useTranslation } from "react-i18next";
import { useQuery, UseQueryOptions } from "react-query";
import { firebaseCallable } from "../features/firebase";
import { langs } from "../features/i18next/LanguageSelector";
import { BibleId } from "../types";

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
  const randomGPromise =
    firebaseCallable<
      {
        reference: string;
        text: string;
        source: string;
      },
      BibleId
    >("randomGPromise");

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
