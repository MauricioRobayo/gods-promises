import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { GPromiseDTO } from "@mauriciorobayo/gods-promises/lib/models";
import { firebaseCallable } from "../services/firebase";

export default function useRandomGPromise() {
  const queryClient = useQueryClient();
  const getRandomGPromise = firebaseCallable<GPromiseDTO>("randomGPromise");

  async function randomGPromise() {
    const gPromise = await getRandomGPromise();
    queryClient.setQueryData(["promise", gPromise.id], gPromise);
    return gPromise;
  }
  const { data, isLoading, isFetching, isError } = useQuery<GPromiseDTO>(
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
