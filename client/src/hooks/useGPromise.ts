import { useQuery } from "react-query";
import { firebaseCallable } from "../features/firebase";
import { GPromise } from "../features/gPromises/gPromiseSlice";

export default function useGPromise(gPromiseId: string) {
  const getPromiseById = firebaseCallable<GPromise, string>("promise");
  return useQuery(["promise", gPromiseId], () => getPromiseById(gPromiseId), {
    staleTime: Infinity,
  });
}
