import {GPromisesRepository} from "@mauriciorobayo/gods-promises/lib/repositories";
import {
  getReferences,
  makeGPromises,
} from "@mauriciorobayo/gods-promises/lib/utils";
import admin from "firebase-admin";
import * as functions from "firebase-functions";
import {Options, TwitterApi, Tweet} from "./api";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://promises-edfea.firebaseio.com",
});

const gPromisesRepository = new GPromisesRepository(
  functions.config().mongodb.uri
);

const twitterApi = new TwitterApi({
  apiKey: functions.config().twitter.api_key,
  apiSecretKey: functions.config().twitter.api_secret_key,
  bearerToken: functions.config().twitter.bearer_token,
  accessTokenSecret: functions.config().twitter.access_token_secret,
  accessToken: functions.config().twitter.access_token,
});

export const twitter = functions.pubsub
  .schedule("every 25 minutes")
  .onRun(() => {
    retweetGodsPromises();
  });

async function retweetGodsPromises() {
  const options: Options = {
    max_results: 100,
  };

  try {
    const tweets = await twitterApi.searchRecent(
      "#GodsPromises -is:retweet",
      options
    );

    if (tweets.length === 0) {
      return;
    }

    const tweetsWithReferences: {tweet: Tweet; references: string[]}[] = tweets
      .map((tweet) => {
        const references = getReferences(tweet.text);
        return {
          references,
          tweet,
        };
      })
      .filter(({references}) => references.length > 0);

    const gPromises = tweetsWithReferences
      .map(({tweet, references}) => {
        return makeGPromises(references, {
          type: "tweet",
          id: tweet.id,
        });
      })
      .flat();

    const retweetsPromises = Promise.all(
      tweetsWithReferences.map(({tweet}) => twitterApi.retweet(tweet.id))
    );
    const insertPromises =
      gPromisesRepository.insertManyEnsureUniquePubId(gPromises);
    const [retweets, insertResults] = await Promise.all([
      retweetsPromises,
      insertPromises,
    ]);

    functions.logger.info(`Retweeted ${retweets.length} tweets`);
    functions.logger.info(
      `Inserted ${insertResults.insertedIds.length} IGPromises`
    );
    functions.logger.info(
      `Skipped ${insertResults.skippedNivs.length} IGPromises`
    );
  } catch (err) {
    functions.logger.error(err);
  }
}

retweetGodsPromises().then(() => process.exit());
