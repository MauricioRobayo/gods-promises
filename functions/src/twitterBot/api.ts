/* eslint-disable camelcase */
import axios from "axios";
import {logger} from "firebase-functions";
import oAuthRequest from "twitter-v1-oauth";
import {IStore} from "./IStore";
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
type LikeResponse = {
  data: {
    liked: boolean;
  };
};
type RetweetResponse =
  | {
      created_at: string;
      id: number;
      id_str: string;
      text: string;
      // a bunch of fields missing ...
    }
  | {
      data: {
        retweeted: boolean;
      };
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
  private _oAuthOptions: {
    api_key: string;
    api_secret_key: string;
    access_token: string;
    access_token_secret: string;
  };
  private _bearerToken: string;
  private _store: IStore<Meta>;
  private _logger: Logger;
  private _v1ApiEndpoint = "https://api.twitter.com/1.1";
  private _v2ApiEndpoint = "https://api.twitter.com/2";
  private _botUserId = "1409686139657728003";

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
    this._oAuthOptions = {
      api_key: apiKey,
      api_secret_key: apiSecretKey,
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
    };
    this._bearerToken = bearerToken;
    this._store = store;
    this._logger = logger;
  }

  async like(id: string): Promise<LikeResponse> {
    const likeRequest = oAuthRequest({
      method: "POST",
      baseURL: `${this._v2ApiEndpoint}/users/${this._botUserId}/likes`,
      data: {
        tweet_id: id,
      },
      oAuthOptions: this._oAuthOptions,
    });

    logger.log(`TwitterApi.like: '${id}'`);

    return this.request<LikeResponse>(likeRequest);
  }

  async searchRecent(query: string, options: Options = {}): Promise<Tweet[]> {
    const lastSearchMeta = await this._store.get();

    if (lastSearchMeta?.newest_id) {
      options.since_id = lastSearchMeta.newest_id;
    }

    this._logger.log("TwitterApi.searchRecent", options);

    const response = await this.request<{
      data?: Tweet[];
      meta: Meta;
    }>({
      method: "GET",
      baseURL: `${this._v2ApiEndpoint}/tweets/search/recent`,
      params: {
        query,
        ...options,
      },
      headers: {
        authorization: `Bearer ${this._bearerToken}`,
      },
    });

    const {meta, data: tweets = []} = response;

    if (meta.newest_id) {
      await this._store.set(meta);
    }

    return tweets;
  }

  async retweet(id: string): Promise<RetweetResponse> {
    const ALREADY_RETWEETED_ERROR_CODE = 327;
    const retweetRequest = oAuthRequest({
      oAuthOptions: this._oAuthOptions,
      baseURL: `${this._v1ApiEndpoint}/statuses/retweet/${id}.json`,
      method: "POST",
    });

    logger.log(`TwitterApi.retweet: '${id}'`);

    try {
      return this.request<RetweetResponse>(retweetRequest);
    } catch (err) {
      if (
        err.data.errors.some(
          ({code}: {code: number}) => code === ALREADY_RETWEETED_ERROR_CODE
        )
      ) {
        logger.warn(`TwitterApi.retweet: Already retweeted tweet id ${id}!`);
        return {
          data: {
            retweeted: true,
          },
        };
      }
      throw new Error(err);
    }
  }

  private async request<T>(request: {
    method: "GET" | "POST" | "PUT" | "DELETE";
    baseURL: string;
    params?: any;
    data?: any;
    headers?: any;
  }): Promise<T> {
    const {data} = await axios.request<T>(request);
    return data;
  }
}
