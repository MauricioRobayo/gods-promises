import {GPromisesRepository} from "@mauriciorobayo/gods-promises/lib/repositories";
import {
  getReferences,
  makeGPromises,
} from "@mauriciorobayo/gods-promises/lib/utils";
import admin from "firebase-admin";
import * as functions from "firebase-functions";
import {Meta, Options, Tweet, TwitterApi} from "./api";
import FirebaseStore from "./FirestoreStore";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://promises-edfea.firebaseio.com",
});

const gPromisesRepository = new GPromisesRepository(
  functions.config().mongodb.uri
);

const store = new FirebaseStore<Meta>("godsPromises", "retweets");

const twitterApi = new TwitterApi(
  {
    apiKey: functions.config().twitter.api_key,
    apiSecretKey: functions.config().twitter.api_secret_key,
    bearerToken: functions.config().twitter.bearer_token,
    accessTokenSecret: functions.config().twitter.access_token_secret,
    accessToken: functions.config().twitter.access_token,
  },
  store
);

export const scrapeTweets = functions.pubsub
  .schedule("every 25 minutes")
  .onRun(async () => {
    const tweetsWithReferences = await twitterScraper();

    const gPromises = tweetsWithReferences
      .map(({tweet, references}) => {
        return makeGPromises(references, {
          type: "tweet",
          id: tweet.id,
        });
      })
      .flat();

    await gPromisesRepository.insertManyAssigningUniquePubId(gPromises);
    await twitterApi.retweetBatch(tweetsWithReferences.map(({tweet}) => tweet));
  });

async function twitterScraper(): Promise<
  {tweet: Tweet; references: string[]}[]
> {
  const options: Options = {
    max_results: 100,
  };

  try {
    const tweets = await twitterApi.searchRecent(
      "#GodsPromises -is:retweet",
      options
    );

    if (tweets.length === 0) {
      return [];
    }

    return tweets
      .map((tweet) => {
        const references = getReferences(tweet.text);
        return {
          references,
          tweet,
        };
      })
      .filter(({references}) => references.length > 0);
  } catch (err) {
    functions.logger.error(err);
    return [];
  }
}
