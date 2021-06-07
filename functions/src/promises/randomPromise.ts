import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import BibleSuperSearch from "./api/bibleSuperSearch";
import {osisToHumanReadableReference, getMongoDbCollection} from "../helpers";

const BIBLE_ID = "kjv";
const bibleSuperSearch = new BibleSuperSearch();

admin.initializeApp();

export const randomPromise = functions.https.onRequest(async (_req, res) => {
  const collection = await getMongoDbCollection("promises");
  const cursor = collection.aggregate([{$sample: {size: 1}}]);
  const [randomPromise] = await cursor.toArray();
  try {
    const humanReadableReference = osisToHumanReadableReference(
      randomPromise.osis
    );
    if (randomPromise.content?.[BIBLE_ID]) {
      res.json({
        text: randomPromise.content[BIBLE_ID].text,
        reference: randomPromise.content[BIBLE_ID].reference,
        source: randomPromise.source,
      });
      return;
    }
    const text = await bibleSuperSearch.getPassageFromReference(
      BIBLE_ID,
      humanReadableReference
    );
    const updatedRandomPromise = {
      ...randomPromise,
      content: {
        ...randomPromise.content,
        [BIBLE_ID]: {
          text,
          reference: randomPromise.reference,
        },
      },
    };
    collection.updateOne(
      {_id: randomPromise._id},
      {
        $set: {
          [`content.${BIBLE_ID}`]: {
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
