import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { GPromise } from "../features/gPromises/gPromisesSlice";

export default function useRandomGPromise() {
  const queryClient = useQueryClient();

  async function randomGPromise() {
    const { data } = await axios.get("/random");
    queryClient.setQueryData(["promise", data.id], data);
    return data;
  }
  const { data, isLoading, isFetching, isError } = useQuery<GPromise>(
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
