import axios from "axios";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const bibleApiKey = process.env.BIBLE_API_KEY;
const bibleApiBaseUrl = "https://api.scripture.api.bible/v1";
const BIBLE_ID = "592420522e16049f-01";
const db = admin.firestore();

if (!bibleApiKey) {
  throw new Error("Could not found bible API key!");
}

export const randomPromise = functions.https.onRequest(async (req, res) => {
  const promisesCollection = db.collection("promises");
  const indexSnapshot = await promisesCollection.doc("index").get();
  const indexData = indexSnapshot.data();

  if (!indexData) {
    functions.logger.error("Could not retrieve index!");
    res.status(500).json({error: "Could not retrieve index!"});
    return;
  }

  const {references, count} = indexData;
  const randomRef = references[Math.floor(Math.random() * count)];
  functions.logger.log(`randomRef: ${randomRef}`);
  const promiseRef = promisesCollection.doc(randomRef);
  const promiseSnapshot = await promiseRef.get();
  const promiseData = promiseSnapshot.data();
  functions.logger.log(`promiseData: ${promiseData}`);

  if (promiseData?.[BIBLE_ID]) {
    res.json(promiseData[BIBLE_ID]);
    return;
  }

  try {
    const searchParams = new URLSearchParams({
      fuzziness: "0",
      query: randomRef,
    });
    const {data} = await axios(
      `${bibleApiBaseUrl}/bibles/${BIBLE_ID}/search?${searchParams}`,
      {headers: {"api-key": bibleApiKey}}
    );
    const {reference, content} = data.data.passages[0];
    const updatedPromise = {
      ...promiseData,
      [BIBLE_ID]: {
        content,
        reference,
      },
    };
    await promiseRef.set(updatedPromise);
    res.json(updatedPromise[BIBLE_ID]);
  } catch (err) {
    if (err.response) {
      functions.logger.error(`Failed to get '${randomRef}'!`);
      res.status(err.response.status).json(err.response.data);
      return;
    }
    res.status(500).send(err);
  }
});
