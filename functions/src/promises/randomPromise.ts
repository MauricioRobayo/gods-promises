import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {MongoClient, Collection} from "mongodb";
import * as osisToEn from "bible-reference-formatter";
import bibleSuperSearchApi from "./bibleSuperSearchApi";

const config = functions.config();

admin.initializeApp();

const getMongoDbCollection = async (
  collection: string
): Promise<Collection> => {
  const client = new MongoClient(config.mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(config.mongodb.database);
  return db.collection(collection);
};

const osisToHumanReadableReference = (osis: string): string =>
  osisToEn("niv-long", osis).replace(/–/g, "-");

export const randomPromise = functions.https.onRequest(async (_req, res) => {
  try {
    const collection = await getMongoDbCollection("promises");
    const cursor = collection.aggregate([{$sample: {size: 1}}]);
    const [randomPromise] = await cursor.toArray();
    const humanReadableReference = osisToHumanReadableReference(
      randomPromise.osis
    );
    const text = await bibleSuperSearchApi("en", humanReadableReference);
    res.send({
      text,
      reference: humanReadableReference,
      source: randomPromise.source,
    });
  } catch (err) {
    functions.logger.error(`randomPromise failed: ${err.message}`);
    throw new functions.https.HttpsError(
      "internal",
      "Something unexpected went wrong!"
    );
  }
});
