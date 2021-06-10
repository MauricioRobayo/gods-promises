import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

export default function useRandomGPromise() {
  const queryClient = useQueryClient();

  async function randomGPromise() {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/random`);
    console.log(`💀 fetching random query...`);

    queryClient.setQueryData(["promise", data.id], data);
    return data;
  }

  return useQuery("randomGPromise", randomGPromise, {
    staleTime: 0,
  });
}
