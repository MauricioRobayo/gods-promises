import {DocumentReference} from "@google-cloud/firestore";
import admin from "firebase-admin";
import * as functions from "firebase-functions";
import {Meta, searchRecent} from "./api";
const BcvParser =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("bible-passage-reference-parser/js/en_bcv_parser").bcv_parser;

const bcv = new BcvParser();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://promises-edfea.firebaseio.com",
});

class SearchHistory {
  private docRef: DocumentReference<FirebaseFirestore.DocumentData>;
  constructor() {
    this.docRef = admin.firestore().collection("retweets").doc("GodsPromises");
  }

  async getLastSearchMeta(): Promise<Meta | undefined> {
    const doc = await this.docRef.get();
    const data = doc.data();
    return data as Meta | undefined;
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
  const options = lastSearchMeta?.newestId
    ? {since_id: lastSearchMeta.newestId}
    : {};

  try {
    const {meta, tweets} = await searchRecent(
      addHashtagIfMissing(hashtag),
      options
    );

    if (meta.resultCount === 0) {
      return;
    }

    await searchHistory.setLastSearchMeta(meta);

    tweets.forEach((tweet) => {
      const osis: string = bcv.parse(tweet.text).osis();

      console.log({text: tweet.text, osis});
    });

    await searchHistory.setLastSearchMeta(meta);
  } catch (err) {
    console.log(err);
  }
}

retweetHashtag("GodsPromises");
