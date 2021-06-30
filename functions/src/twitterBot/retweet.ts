import admin from "firebase-admin";
import * as functions from "firebase-functions";
import {searchRecent, Tweet} from "./api";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://promises-edfea.firebaseio.com",
});

export const retweet = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(() => {
    retweetHashtag("GodsPromises");
  });

async function retweetHashtag(hashtag: string): Promise<Tweet[]> {
  const docRef = admin.firestore().collection("retweets").doc("GodsPromises");
  const lastRetweetInfo = await docRef.get();
  const lastRetweetId = lastRetweetInfo.data()?.newestId;

  const options = lastRetweetId ? {since_id: lastRetweetId} : {};

  const addHashtagIfMissing = (hashtag: string): string =>
    hashtag.startsWith("#") ? hashtag : `#${hashtag}`;

  try {
    const {meta, data} = await searchRecent(
      addHashtagIfMissing(hashtag),
      options
    );

    if (meta.result_count > 0) {
      docRef.set({newestId: meta.newest_id});
    }

    return data || [];
  } catch (err) {
    console.log(err);
  }
  return [];
}

retweetHashtag("GodsPromises").then((result) => console.log({result}));
