import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { GPromise } from "../features/gPromises/gPromisesSlice";

export default function useRandomGPromise() {
  const queryClient = useQueryClient();

  async function randomGPromise() {
    console.log({ apiUrl: process.env.REACT_APP_API_URL });

    const { data } = await axios.get("/random");
    queryClient.setQueryData(["promise", data.id], data);
    return data;
  }
  const { data, isLoading, isError } = useQuery<GPromise>(
    "randomGPromise",
    randomGPromise,
    {
      staleTime: Infinity,
    }
  );

  return {
    data,
    isLoading,
    isError,
  };
}
