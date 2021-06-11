import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { addGPromise } from "../features/gPromises/gPromisesSlice";

export default function useRandomGPromise() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  async function randomGPromise() {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/random`);
    queryClient.setQueryData(["promise", data.id], data);
    return data;
  }
  const { data, isLoading, isError } = useQuery(
    "randomGPromise",
    randomGPromise,
    {
      staleTime: Infinity,
      onSuccess: (gPromise) => dispatch(addGPromise(gPromise)),
    }
  );

  return {
    data,
    isLoading,
    isError,
  };
}
