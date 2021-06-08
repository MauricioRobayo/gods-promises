import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import BibleSuperSearch from "./api/bibleSuperSearch";
import {
  osisToHumanReadableReference,
  getRandomPromises,
  getMongoDbCollection,
} from "../helpers";

const BIBLE_ID = "kjv";
const bibleSuperSearch = new BibleSuperSearch();

admin.initializeApp();

export const randomPromise = functions.https.onCall(async () => {
  const promisesCollection = await getMongoDbCollection("promises");
  const randomPromises = await getRandomPromises(100);
  try {
    for (const randomPromise of randomPromises) {
      const humanReadableReference = osisToHumanReadableReference(
        randomPromise.osis
      );

      if (!humanReadableReference) {
        await promisesCollection.updateOne(
          {_id: randomPromise._id},
          {
            $set: {
              errors: [
                `osisToHumanReadableReference failed on '${randomPromise.osis}'`,
              ],
            },
          }
        );
        continue;
      }

      if (randomPromise.content?.[BIBLE_ID]) {
        return {
          text: randomPromise.content[BIBLE_ID].text,
          reference: randomPromise.content[BIBLE_ID].reference,
          source: randomPromise.source,
        };
      }

      const response = await bibleSuperSearch.getPassageFromReference(
        BIBLE_ID,
        humanReadableReference
      );

      if (response.status === "success") {
        await promisesCollection.updateOne(
          {_id: randomPromise._id},
          {
            $set: {
              [`content.${BIBLE_ID}`]: {
                text: response.text,
                reference: humanReadableReference,
              },
            },
          }
        );
        return {
          text: response.text,
          reference: humanReadableReference,
          source: randomPromise.source,
        };
      }

      await promisesCollection.updateOne(
        {_id: randomPromise._id},
        {
          $set: {
            errors: response.errors,
          },
        }
      );
    }
  } catch (err) {
    functions.logger.error(`randomPromise error: ${JSON.stringify(err)}`);
    throw new functions.https.HttpsError("internal", "randomPromise error");
  }
  functions.logger.error("Could not get a random promise!");
  throw new functions.https.HttpsError("internal", "randomPromise failed");
});
