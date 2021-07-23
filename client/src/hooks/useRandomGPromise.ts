import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { GPromiseDTO } from "@mauriciorobayo/gods-promises/lib/models";
import { firebaseCallable } from "../services/firebase";

export default function useRandomGPromise() {
  const queryClient = useQueryClient();
  const getRandomGPromise = firebaseCallable<GPromiseDTO>("random");

  async function randomGPromise() {
    const gPromise = await getRandomGPromise();
    queryClient.setQueryData(["promise", gPromise.id], gPromise);
    return gPromise;
  }

  return useQuery("randomGPromise", randomGPromise, {
    staleTime: Infinity,
  });
}
