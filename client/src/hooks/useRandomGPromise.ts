import axios from "axios";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";

export default function useRandomGPromise() {
  const queryClient = useQueryClient();
  const { push } = useHistory();
  const {
    i18n: { language },
  } = useTranslation();

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
    }
  );

  useEffect(() => {
    if (isLoading || isError) {
      return;
    }
    push(`/${language}/p/${data.id}`);
  }, [push, language, data, isLoading, isError]);

  return {
    data,
    isLoading,
    isError,
  };
}
