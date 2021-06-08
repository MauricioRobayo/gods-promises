import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import BibleSuperSearch from "./api/bibleSuperSearch";
import {
  osisToHumanReadableReference,
  getRandomPromises,
  getMongoDbCollection,
} from "../helpers";
import {BibleId} from "../types";

const bibleSuperSearch = new BibleSuperSearch();

admin.initializeApp();

export const randomGPromise = functions.https.onCall(
  async (bibleId: BibleId) => {
    const promisesCollection = await getMongoDbCollection("g-promises");
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

        if (randomPromise.content?.[bibleId]) {
          return {
            text: randomPromise.content[bibleId].text,
            reference: randomPromise.content[bibleId].reference,
            source: randomPromise.source,
          };
        }

        const response = await bibleSuperSearch.getPassageFromReference(
          bibleId,
          humanReadableReference
        );

        if (response.status === "success") {
          await promisesCollection.updateOne(
            {_id: randomPromise._id},
            {
              $set: {
                [`content.${bibleId}`]: {
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
  }
);
