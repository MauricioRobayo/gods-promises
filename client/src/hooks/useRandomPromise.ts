import { useQuery, UseQueryOptions } from "react-query";
import axios from "axios";

type UseRandomPromiseOptions = Pick<
  UseQueryOptions,
  | "refetchOnMount"
  | "refetchOnWindowFocus"
  | "refetchOnReconnect"
  | "cacheTime"
  | "staleTime"
>;

const useRandomPromise = ({
  refetchOnMount = false,
  refetchOnWindowFocus = false,
  refetchOnReconnect = false,
  cacheTime = 60 * 60 * 1000,
  staleTime = 60 * 60 * 1000,
}: UseRandomPromiseOptions = {}) => {
  const fetchRandomPromise = async () => {
    try {
      const response = await axios.get("/randomPromise");
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  return useQuery("randomPromise", fetchRandomPromise, {
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect,
    cacheTime,
    staleTime,
  });
};

export default useRandomPromise;
