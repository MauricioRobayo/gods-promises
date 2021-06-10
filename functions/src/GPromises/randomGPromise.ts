import * as functions from "firebase-functions";
import BibleSuperSearch from "./api/bibleSuperSearch";
import {
  osisToHumanReadableReference,
  getMongoDbCollection,
  translator,
  getMissingBibles,
} from "../helpers";
import {getRandomPromises} from "../queries";
import {GPromiseDTO, IGPromise} from "../models/GPromise";
import {bibles, bibleIds} from "../config";

const bibleSuperSearch = new BibleSuperSearch(bibles, translator);

export const randomGPromise = functions.https.onRequest(
  async (_req: functions.Request, res: functions.Response<GPromiseDTO>) => {
    const gPromisesCollection = await getMongoDbCollection<IGPromise>(
      "g-promises"
    );
    const randomGPromises = await getRandomPromises(100);

    try {
      for (const randomGPromise of randomGPromises) {
        const humanReadableReference = osisToHumanReadableReference(
          randomGPromise.osis
        );

        if (humanReadableReference.isError) {
          await gPromisesCollection.updateOne(
            {_id: randomGPromise._id},
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

        const missingBibleIds = getMissingBibles(
          bibleIds,
          randomGPromise.content
        );
        if (missingBibleIds.length === 0) {
          res.json(randomGPromise.toDTO());
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
          randomGPromise.content = newContent;
          res.json(randomGPromise.toDTO());
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
