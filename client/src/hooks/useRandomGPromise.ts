import axios from "axios";
import { useQuery } from "react-query";

export default function useRandomGPromise() {
  async function randomGPromise() {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/random`);
    return data;
  }

  return useQuery("randomGPromise", randomGPromise, {
    retry: false,
    staleTime: Infinity,
  });
}
