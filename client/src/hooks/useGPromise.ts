import { useQuery } from "react-query";
import { firebaseCallable } from "../services/firebase";
import { IGPromise } from "@mauriciorobayo/gods-promises/lib/models";

export default function useGPromise(gPromiseId: string) {
  const getPromiseById = firebaseCallable<IGPromise, string>("promise");
  return useQuery(["promise", gPromiseId], () => getPromiseById(gPromiseId), {
    staleTime: Infinity,
  });
}
