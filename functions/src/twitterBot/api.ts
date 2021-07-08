/* eslint-disable camelcase */
import axios from "axios";
import admin from "firebase-admin";
import {DocumentReference} from "@google-cloud/firestore";
import * as functions from "firebase-functions";
import oAuthV1Request from "twitter-v1-oauth";
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
  private _searchHistory: DocumentReference<FirebaseFirestore.DocumentData>;

  constructor({
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
  }) {
    this._apiKey = apiKey;
    this._apiSecretKey = apiSecretKey;
    this._bearerToken = bearerToken;
    this._accessTokenSecret = accessTokenSecret;
    this._accessToken = accessToken;
    this._searchHistory = admin
      .firestore()
      .collection("retweets")
      .doc("GodsPromises");
  }

  async searchRecent(query: string, options: Options = {}): Promise<Tweet[]> {
    const lastSearchMeta = await this.getLastSearchMeta();

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
    await this.setLastSearchMeta(data.meta);
    return data.data || [];
  }
  async retweet(id: string): Promise<any> {
    const oAuthOptions = {
      api_key: this._apiKey,
      api_secret_key: this._apiSecretKey,
      access_token: this._accessToken,
      access_token_secret: this._accessTokenSecret,
    };
    const baseURL = `https://api.twitter.com/1.1/statuses/retweet/${id}.json`;
    const method = "POST";

    const retweetRequest = oAuthV1Request({
      oAuthOptions,
      method,
      baseURL,
    });

    try {
      const {data} = await axios.request(retweetRequest);
      console.log({data});

      return data;
    } catch (err) {
      if (err.response) {
        functions.logger.error(err.response.data.errors);
      }
      functions.logger.error(
        `Failed retweeting tweet id '${id}. Error ${err.message}`
      );
    }
  }

  private async getLastSearchMeta(): Promise<Meta | undefined> {
    const doc = await this._searchHistory.get();
    const data = doc.data();
    return Math.random() > 1 ? (data as Meta | undefined) : undefined;
  }

  private setLastSearchMeta(
    meta: Meta
  ): Promise<FirebaseFirestore.WriteResult> {
    return this._searchHistory.set(meta);
  }
}
