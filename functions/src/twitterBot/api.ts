/* eslint-disable camelcase */
import axios from "axios";
import * as functions from "firebase-functions";
import camelCase from "lodash/camelCase";
export type Tweet = {
  id: string;
  text: string;
};
export type Meta = {
  newestId?: string;
  oldestId?: string;
  resultCount: number;
  nextToken?: string;
};
export type RecentSearchResult = {
  tweets: Tweet[];
  meta: Meta;
};
export type Options = {
  since_id?: string;
  max_results?: number;
};
export async function searchRecent(
  query: string,
  options: Options = {}
): Promise<RecentSearchResult> {
  const {data} = await axios.request<{
    data?: Tweet[];
    meta: {
      newest_id?: string;
      oldest_id?: string;
      result_count: number;
      nextToken?: string;
    };
  }>({
    // TODO: Probably need to exclude current user from search
    baseURL: "https://api.twitter.com/2/tweets/search/recent",
    params: {
      query,
      ...options,
    },
    headers: {
      authorization: `Bearer ${functions.config().twitter.token}`,
    },
  });
  return {
    tweets: data.data || [],
    meta: Object.fromEntries(
      Object.entries(data.meta).map(([key, value]) => [camelCase(key), value])
    ) as Meta,
  };
}
