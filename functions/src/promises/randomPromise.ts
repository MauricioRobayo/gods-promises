import axios from "axios";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {MongoClient, Collection} from "mongodb";
import * as osisToEn from "bible-reference-formatter";

const config = functions.config();

const BIBLE_ID = "kjv";

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

type ApiResult = {
  verses: {
    [bibleId: string]: {
      [chapter: string]: {
        [verse: string]: {
          id: number;
          book: number;
          chapter: number;
          verse: number;
          text: string;
          italics: string;
          claimed: boolean;
        };
      };
    };
  };
};
type ApiResponse = {
  results: ApiResult[];
};

const buildPromiseTextFromResponse = (response: ApiResponse): string => {
  return response.results
    .map(({verses}) => {
      const chapters = Object.values(verses[BIBLE_ID]);
      return chapters
        .map((chapter) => {
          const verses = Object.values(chapter);
          return verses.map(({text}) => text).join("\n");
        })
        .join("\n");
    })
    .join("\n");
};

export const randomPromise = functions.https.onRequest(async (_req, res) => {
  try {
    const collection = await getMongoDbCollection("promises");
    const cursor = collection.aggregate([{$sample: {size: 1}}]);
    const [randomPromise] = await cursor.toArray();
    const humanReadableReference = osisToHumanReadableReference(
      randomPromise.osis
    );
    const {data} = await axios.get(
      `https://api.biblesupersearch.com/api?bible=${BIBLE_ID}&reference=${humanReadableReference}`
    );
    const text = buildPromiseTextFromResponse(data);
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
