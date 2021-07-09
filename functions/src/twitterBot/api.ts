/* eslint-disable camelcase */
import oAuthRequest from "twitter-v1-oauth";
import axios from "axios";
import {IStore} from "./IStore";
import {logger} from "firebase-functions";
export type Tweet = {
  id: string;
  text: string;
};
export type Meta = {
  newest_id?: string;
  oldest_id?: string;
  result_count: number;
  next_token?: string;
};
export type Options = {
  since_id?: string;
  max_results?: number;
};
type Logger = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  log(...args: any[]): void;
  error(...args: any[]): void;
  warn(...args: any[]): void;
  info(...args: any[]): void;
  /* eslint-enable @typescript-eslint/no-explicit-any */
};

export class TwitterApi {
  private _apiKey: string;
  private _apiSecretKey: string;
  private _bearerToken: string;
  private _accessTokenSecret: string;
  private _accessToken: string;
  private _store: IStore<Meta>;
  private _logger: Logger;

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
    store: IStore<Meta>,
    logger: Logger = console
  ) {
    this._apiKey = apiKey;
    this._apiSecretKey = apiSecretKey;
    this._bearerToken = bearerToken;
    this._accessTokenSecret = accessTokenSecret;
    this._accessToken = accessToken;
    this._store = store;
    this._logger = logger;
  }

  async searchRecent(query: string, options: Options = {}): Promise<Tweet[]> {
    const lastSearchMeta = await this._store.get();

    if (lastSearchMeta?.newest_id) {
      options.since_id = lastSearchMeta.newest_id;
    }

    this._logger.log("TwitterApi.searchRecent options:", options);

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

    const tweets = data.data || [];
    this._logger.log(
      `TwitterApi.searchRecent found ${tweets.length} new tweets`
    );
    return tweets;
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

    try {
      await axios.request(retweetRequest);
    } catch (err) {
      if (err.response) {
        logger.error("TwitterApi.retweet response error", err.response);
        return;
      }
      logger.error("TwitterApi.retweet error", err);
      return;
    }
  }

  async retweetBatch(tweets: Tweet[]): Promise<void> {
    await Promise.all(tweets.map(({id}) => this.retweet(id)));
    return;
  }
}
