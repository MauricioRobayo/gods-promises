import { useQuery } from "react-query";
import { firebaseCallable } from "../services/firebase";
import { GPromiseDTO } from "@mauriciorobayo/gods-promises/lib/models";

export default function useGPromise(gPromiseId: string) {
  const getPromiseById = firebaseCallable<GPromiseDTO, string>("promise");
  return useQuery<GPromiseDTO>(
    ["promise", gPromiseId],
    () => getPromiseById(gPromiseId),
    {
      staleTime: Infinity,
    }
  );
}
