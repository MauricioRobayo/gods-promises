import axios from "axios";
import { useQuery } from "react-query";

export default function useRandomGPromise() {
  async function randomGPromise() {
    const { data } = await axios.get("/random");
    return data;
  }

  return useQuery("randomGPromise", randomGPromise, {
    retry: false,
    staleTime: Infinity,
  });
}
