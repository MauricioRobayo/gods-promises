import axios from "axios";
import {nanoid} from "nanoid";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const bibleApiKey = process.env.BIBLE_API_KEY;
const bibleApiBaseUrl = "https://api.scripture.api.bible/v1";
const db = admin.firestore();

if (!bibleApiKey) {
  throw new Error("Could not found bible API key!");
}

const isValidQueryParam = (param: any): param is string => {
  return param && typeof param === "string";
};

export const randomPromise = functions.https.onRequest(async (req, res) => {
  const {bibleId} = req.query;

  if (!isValidQueryParam(bibleId)) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Please specify a 'bibleId'!"
    );
  }

  const promisesCollection = db.collection("promises");
  const indexSnapshot = await promisesCollection.doc("index").get();
  const indexData = indexSnapshot.data();

  if (!indexData) {
    throw new functions.https.HttpsError(
      "internal",
      "Could not retrieve index!"
    );
  }

  const {promises, count} = indexData;
  const randomRef = promises[Math.floor(Math.random() * count)];
  functions.logger.info(`randomRef: ${randomRef}`);
  const promiseRef = promisesCollection.doc(randomRef.id);
  const promiseSnapshot = await promiseRef.get();
  const promiseData = promiseSnapshot.data();

  if (promiseData?.[bibleId]) {
    functions.logger.info(
      `promise already in firestore, returning promise: ${promiseData}`
    );
    res.json(promiseData[bibleId]);
    return;
  }

  try {
    functions.logger.info("Promise not in firestore, getting it from API...");
    const searchParams = new URLSearchParams({
      fuzziness: "0",
      query: randomRef,
    });
    const {data} = await axios(
      `${bibleApiBaseUrl}/bibles/${bibleId}/search?${searchParams}`,
      {headers: {"api-key": bibleApiKey}}
    );
    const {reference, content} = data.data.passages[0];
    const updatedPromise = {
      ...promiseData,
      [bibleId]: {
        id: nanoid(8),
        content,
        reference,
      },
    };
    await promiseRef.set(updatedPromise);
    res.json(updatedPromise[bibleId]);
  } catch (err) {
    if (err.response) {
      functions.logger.error(`Failed to get '${randomRef}'!`);
      res.status(err.response.status).json(err.response.data);
      return;
    }
    res.status(500).send(err);
  }
});
