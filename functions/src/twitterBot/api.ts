/* eslint-disable camelcase */
import axios from "axios";
import * as functions from "firebase-functions";
export type Tweet = {
  id: string;
  text: string;
};
export type RecentSearchResult = {
  data?: Tweet[];
  meta: {
    newest_id?: string;
    oldest_id?: string;
    result_count: number;
    next_token?: string;
  };
};
type Options = {
  since_id?: string;
  max_results?: number;
};
export async function searchRecent(
  query: string,
  options: Options = {}
): Promise<RecentSearchResult> {
  const {data} = await axios.request<RecentSearchResult>({
    baseURL: "https://api.twitter.com/2/tweets/search/recent",
    params: {
      query,
      ...options,
    },
    headers: {
      authorization: `Bearer ${functions.config().twitter.token}`,
    },
  });
  return data;
}
