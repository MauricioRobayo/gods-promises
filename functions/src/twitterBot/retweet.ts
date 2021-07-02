import {DocumentReference} from "@google-cloud/firestore";
import {
  getOsisReference,
  gPromiseFromOsisReference,
  // gPromisesFromOsisReferences,
  isGPromise,
  // gPromiseFromOsisReference,
  // isGPromise,
} from "@mauriciorobayo/gods-promises/lib/utils";
import {GPromisesRepository} from "@mauriciorobayo/gods-promises/lib/repositories";
import admin from "firebase-admin";
import * as functions from "firebase-functions";
import {Meta, Options, searchRecent} from "./api";
// import {IGPromise} from "../../../core/lib/models";
// import {IGPromise} from "@mauriciorobayo/gods-promises/lib/models";

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
  .schedule("every 5 minutes")
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

    // await searchHistory.setLastSearchMeta(meta);

    const gPromises = tweets
      .map((tweet) => {
        const osis = getOsisReference(tweet.text);
        return gPromiseFromOsisReference({
          osis,
          source: {
            type: "TwitterBot",
            id: tweet.id,
          },
        });
      })
      .filter(isGPromise);

    console.log(gPromises);

    if (Math.random() > 1) {
      await gPromisesRepository.insertMany(gPromises);
    }

    // const validTweets = tweetsAndGPromises.map(({tweet}) => tweet);
    // const validGPromises = tweetsAndGPromises.map(
    //   ({gPromise}) => gPromise
    // ) as IGPromise[];

    // retweet(validTweets);

    await searchHistory.setLastSearchMeta(meta);
  } catch (err) {
    console.log(err);
  }
}

retweetHashtag("GodsPromises");