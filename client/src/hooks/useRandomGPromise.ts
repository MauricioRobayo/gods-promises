import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  addGPromise,
  GPromise,
  selectAllGPromises,
  setNextGPromise,
} from "../features/gPromises/gPromisesSlice";

export default function useRandomGPromise() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const gPromises = useSelector(selectAllGPromises);

  async function randomGPromise() {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/random`);
    queryClient.setQueryData(["promise", data.id], data);
    return data;
  }
  const { data, isLoading, isError } = useQuery<GPromise>(
    "randomGPromise",
    randomGPromise,
    {
      staleTime: Infinity,
      onSuccess: (gPromise) => {
        if (gPromises.some(({ id }) => id === gPromise.id)) {
          const nextRandomGPromise =
            gPromises[Math.floor(Math.random() * gPromises.length)];
          dispatch(setNextGPromise(nextRandomGPromise));
          return;
        }
        dispatch(addGPromise(gPromise));
        dispatch(setNextGPromise(gPromise));
      },
    }
  );

  return {
    data,
    isLoading,
    isError,
  };
}
