import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { IGPromise } from "@mauriciorobayo/gods-promises/lib/models";

export default function useRandomGPromise() {
  const queryClient = useQueryClient();

  async function randomGPromise() {
    const { data } = await axios.get("/random");
    queryClient.setQueryData(["promise", data.id], data);
    return data;
  }
  const { data, isLoading, isFetching, isError } = useQuery<IGPromise>(
    "randomGPromise",
    randomGPromise,
    {
      staleTime: Infinity,
    }
  );

  return {
    data,
    isLoading,
    isFetching,
    isError,
  };
}
