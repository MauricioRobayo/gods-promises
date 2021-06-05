import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {MongoClient, Collection} from "mongodb";
import * as osisToEn from "bible-reference-formatter";
// import BibleSuperSearch from "./api/bibleSuperSearch";
import ApiBible from "./api/apiBible";

const config = functions.config();
const LANGUAGE = "en";

// const bibleSuperSearch = new BibleSuperSearch();
const apiBible = new ApiBible(config.bible_api.key);

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
  const collection = await getMongoDbCollection("promises");
  const cursor = collection.aggregate([{$sample: {size: 1}}]);
  const [randomPromise] = await cursor.toArray();
  try {
    const humanReadableReference = osisToHumanReadableReference(
      randomPromise.osis
    );
    if (randomPromise.content?.[LANGUAGE]) {
      res.json({
        text: randomPromise.content[LANGUAGE].text,
        reference: randomPromise.content[LANGUAGE].reference,
        source: randomPromise.source,
      });
      return;
    }
    const text = await apiBible.getPassageFromReference(
      LANGUAGE,
      humanReadableReference
    );
    const updatedRandomPromise = {
      ...randomPromise,
      content: {
        ...randomPromise.content,
        [LANGUAGE]: {
          text,
          reference: randomPromise.reference,
        },
      },
    };
    functions.logger.log("😀 5", JSON.stringify(updatedRandomPromise._id));
    collection.updateOne(
      {_id: randomPromise._id},
      {
        $set: {
          [`content.${LANGUAGE}`]: {
            text,
            reference: humanReadableReference,
          },
        },
      }
    );
    res.json({
      text,
      reference: humanReadableReference,
      source: randomPromise.source,
    });
  } catch (err) {
    functions.logger.error(
      `randomPromise failed ${randomPromise.osis}: ${err.message}`
    );
    throw new functions.https.HttpsError(
      "internal",
      "Something unexpected went wrong!"
    );
  }
});
