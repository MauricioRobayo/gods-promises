import * as functions from "firebase-functions";
import BibleSuperSearch from "./api/bibleSuperSearch";
import {
  osisToHumanReadableReference,
  getRandomPromises,
  getMongoDbCollection,
  translator,
  getMissingBibles,
} from "../helpers";
import GPromise, {GPromiseDTO} from "../models/GPromise";
import {bibles, bibleIds} from "../config";

const bibleSuperSearch = new BibleSuperSearch(bibles, translator);

export const randomGPromise = functions.https.onRequest(
  async (req: functions.Request, res: functions.Response<GPromiseDTO>) => {
    const gPromisesCollection = await getMongoDbCollection("g-promises");
    const randomGPromises = await getRandomPromises(100);

    try {
      for (const randomGPromise of randomGPromises) {
        const gPromise = new GPromise(randomGPromise);
        const humanReadableReference = osisToHumanReadableReference(
          gPromise.osis
        );

        if (humanReadableReference.isError) {
          await gPromisesCollection.updateOne(
            {_id: gPromise._id},
            {
              $set: {
                failed: true,
              },
            }
          );
          functions.logger.error(
            `osisToHumanReadableReference failed on '${randomGPromise.osis}' with error '${humanReadableReference.error}'`
          );
          continue;
        }

        const missingBibleIds = getMissingBibles(bibleIds, gPromise.content);
        if (missingBibleIds.length === 0) {
          res.json(gPromise.toDTO());
          return;
        }

        try {
          const content = await bibleSuperSearch.getPassageFromReference(
            missingBibleIds,
            humanReadableReference.data
          );
          const newContent = randomGPromise.content
            ? {
                ...randomGPromise.content,
                ...content,
              }
            : content;
          await gPromisesCollection.updateOne(
            {_id: randomGPromise._id},
            {
              $set: {
                content: newContent,
              },
            }
          );
          gPromise.content = newContent;
          res.json(gPromise.toDTO());
          return;
        } catch (err) {
          functions.logger.error(
            `Failed trying to fetch passages from bibleIds ${missingBibleIds}: ${JSON.stringify(
              err
            )}`
          );
          await gPromisesCollection.updateOne(
            {_id: randomGPromise._id},
            {
              $set: {
                failed: true,
              },
            }
          );
        }
      }
    } catch (err) {
      functions.logger.error(`randomPromise error: ${JSON.stringify(err)}`);
      throw new functions.https.HttpsError("internal", "randomPromise error");
    }
    functions.logger.error("Could not get a random promise!");
    throw new functions.https.HttpsError("internal", "randomPromise failed");
  }
);
