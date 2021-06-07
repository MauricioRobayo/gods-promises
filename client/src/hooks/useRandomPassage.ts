import { useQuery, UseQueryOptions } from "react-query";
import axios from "axios";

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
  const fetchRandomPassage = async () => {
    const { data } = await axios.get("/randomPromise");
    return data;
  };

  return useQuery("randomPromise", fetchRandomPassage, {
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect,
    cacheTime,
    staleTime,
  });
};

export default useRandomPassage;
