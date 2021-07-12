import {IGPromise} from "@mauriciorobayo/gods-promises/lib/models";
import {GPromisesRepository} from "@mauriciorobayo/gods-promises/lib/repositories";
import {
  getReferences,
  makeGPromises,
} from "@mauriciorobayo/gods-promises/lib/utils";
import * as functions from "firebase-functions";
import {Meta, SearchOptions, Tweet, TwitterApi} from "./api";
import FirebaseStore from "./FirestoreStore";

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
  store,
  functions.logger
);

export const scrapeTweets = functions.pubsub
  .schedule("every 4 hours")
  .onRun(async () => {
    const tweets = await twitterScraper();
    functions.logger.log(`Found ${tweets.length} new tweets.`);

    const tweetsWithReferences = tweets.filter(
      ({references}) => references.length > 0
    );
    const tweetsWithoutReferences = tweets.filter(
      ({references}) => references.length === 0
    );

    functions.logger.log(
      `${tweetsWithReferences.length} tweets with references.`
    );
    functions.logger.log(
      `${tweetsWithoutReferences.length} tweets without references.`
    );

    const gPromises = tweetsWithReferences
      .map(({tweet, references}) => {
        return makeGPromises(references, {
          type: "tweet",
          id: tweet.id,
        });
      })
      .flat();

    try {
      await Promise.all([
        insertGPromises(gPromises),
        Promise.all(
          tweetsWithReferences.map(({tweet}) => twitterApi.retweet(tweet.id))
        ),
        Promise.all(
          tweetsWithoutReferences.map(({tweet}) => twitterApi.like(tweet.id))
        ),
      ]);
    } catch (err) {
      functions.logger.error(`scrapeTweets error: ${err}`);
    }
  });

async function insertGPromises(gPromises: Omit<IGPromise, "pubId">[]) {
  try {
    const {insertedIds, skippedNivs} =
      await gPromisesRepository.insertManyAssigningUniquePubId(gPromises);

    functions.logger.log(
      `Inserted ${insertedIds.length} new promises in the database.`
    );
    functions.logger.log(
      `Skipped ${skippedNivs.length} promises from inserting in the database.`
    );
  } catch (e) {
    functions.logger.error(`inserting gPromises failed: ${e.message}`);
  }
}

async function twitterScraper(): Promise<
  {tweet: Tweet; references: string[]}[]
> {
  try {
    const tweets = await twitterApi.searchRecent("#GodsPromises -is:retweet", {
      max_results: 100,
    });

    if (tweets.length === 0) {
      return [];
    }

    return tweets.map((tweet) => {
      const references = getReferences(tweet.text);
      return {
        references,
        tweet,
      };
    });
  } catch (err) {
    functions.logger.error("twitterScrapper error", err);
    return [];
  }
}
