import {DocumentReference} from "@google-cloud/firestore";
import {
  getReferences,
  makeGPromises,
} from "@mauriciorobayo/gods-promises/lib/utils";
import {GPromisesRepository} from "@mauriciorobayo/gods-promises/lib/repositories";
import admin from "firebase-admin";
import * as functions from "firebase-functions";
import {Meta, Options, searchRecent, Tweet} from "./api";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://promises-edfea.firebaseio.com",
});

const gPromisesRepository = new GPromisesRepository();

class SearchHistory {
  private docRef: DocumentReference<FirebaseFirestore.DocumentData>;
  constructor() {
    this.docRef = admin.firestore().collection("retweets").doc("GodsPromises");
  }

  async getLastSearchMeta(): Promise<Meta | undefined> {
    // const doc = await this.docRef.get();
    // const data = doc.data();
    return undefined; // data as Meta | undefined;
  }

  setLastSearchMeta(meta: Meta): Promise<FirebaseFirestore.WriteResult> {
    return this.docRef.set(meta);
  }
}

const searchHistory = new SearchHistory();
const addHashtagIfMissing = (hashtag: string): string =>
  hashtag.startsWith("#") ? hashtag : `#${hashtag}`;

export const retweet = functions.pubsub
  .schedule("every 25 minutes")
  .onRun(() => {
    retweetHashtag("GodsPromises");
  });

async function retweetHashtag(hashtag: string) {
  const lastSearchMeta = await searchHistory.getLastSearchMeta();
  const options: Options = {
    max_results: 100,
  };

  if (lastSearchMeta?.newestId) {
    options.since_id = lastSearchMeta.newestId;
  }

  try {
    const {meta, tweets} = await searchRecent(
      addHashtagIfMissing(hashtag),
      options
    );

    if (meta.resultCount === 0) {
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

    // TODO: Retweet
    tweetsWithReferences.map(({tweet}) => {
      console.log(`Retweeting tweet id ${tweet.id}`);
    });

    const gPromises = tweetsWithReferences
      .map(({tweet, references}) => {
        return makeGPromises(references, {
          type: "tweet",
          id: tweet.id,
        });
      })
      .flat();

    const results = await gPromisesRepository.insertManyCheckUniqueness(
      gPromises
    );
    functions.logger.info(`Inserted ${results.insertedIds.length} IGPromises`);
    functions.logger.info(`Skipped ${results.skippedNivs.length} IGPromises`);
    await searchHistory.setLastSearchMeta(meta);
  } catch (err) {
    console.log(err);
  }
}

retweetHashtag("GodsPromises").then(() => process.exit());
