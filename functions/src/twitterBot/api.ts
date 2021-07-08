/* eslint-disable camelcase */
import oAuthRequest from "twitter-v1-oauth";
import axios from "axios";
import {IStore} from "./IStore";
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
export type Options = {
  since_id?: string;
  max_results?: number;
};

export class TwitterApi {
  private _apiKey: string;
  private _apiSecretKey: string;
  private _bearerToken: string;
  private _accessTokenSecret: string;
  private _accessToken: string;
  private _store: IStore<Meta>;

  constructor(
    {
      apiKey,
      apiSecretKey,
      bearerToken,
      accessTokenSecret,
      accessToken,
    }: {
      apiKey: string;
      apiSecretKey: string;
      bearerToken: string;
      accessTokenSecret: string;
      accessToken: string;
    },
    store: IStore<Meta>
  ) {
    this._apiKey = apiKey;
    this._apiSecretKey = apiSecretKey;
    this._bearerToken = bearerToken;
    this._accessTokenSecret = accessTokenSecret;
    this._accessToken = accessToken;
    this._store = store;
  }

  async searchRecent(query: string, options: Options = {}): Promise<Tweet[]> {
    const lastSearchMeta = await this._store.get();

    if (lastSearchMeta?.newestId) {
      options.since_id = lastSearchMeta.newestId;
    }

    const {data} = await axios.request<{
      data?: Tweet[];
      meta: Meta;
    }>({
      baseURL: "https://api.twitter.com/2/tweets/search/recent",
      params: {
        query,
        ...options,
      },
      headers: {
        authorization: `Bearer ${this._bearerToken}`,
      },
    });
    await this._store.set(data.meta);
    return data.data || [];
  }
  async retweet(id: string): Promise<void> {
    const oAuthOptions = {
      api_key: this._apiKey,
      api_secret_key: this._apiSecretKey,
      access_token: this._accessToken,
      access_token_secret: this._accessTokenSecret,
    };
    const baseURL = `https://api.twitter.com/1.1/statuses/retweet/${id}.json`;
    const method = "POST";

    const retweetRequest = oAuthRequest({
      oAuthOptions,
      method,
      baseURL,
    });

    await axios.request(retweetRequest);
  }
}
