import { useQuery, UseQueryOptions } from "react-query";
import { functions } from "../features/firebase";

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
  const randomPromise = functions.httpsCallable("randomPromise");
  const getRandomPromise = async () => {
    const response = await randomPromise();
    return response.data;
  };

  return useQuery("randomPromise", getRandomPromise, {
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect,
    cacheTime,
    staleTime,
  });
};

export default useRandomPassage;
