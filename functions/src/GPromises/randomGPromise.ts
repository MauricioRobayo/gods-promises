import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import BibleSuperSearch from "./api/bibleSuperSearch";
import {
  osisToHumanReadableReference,
  getRandomPromises,
  getMongoDbCollection,
  translator,
} from "../helpers";
import GPromise, {Content, GPromiseDTO} from "../models/GPromise";
import {bibles, bibleIds} from "../config";
import {BibleId, BibleIds} from "../types";

const bibleSuperSearch = new BibleSuperSearch(bibles, translator);

admin.initializeApp();

export function getMissingKeysInObject<T extends string>(
  ids: T[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any> = {}
): T[] {
  const objectKeys = Object.keys(content);
  const missingKeys = [];
  for (const key of ids) {
    if (!objectKeys.includes(key)) {
      missingKeys.push(key);
    }
  }
  return missingKeys;
}

const getMissingBibles = (bibles: BibleIds, content: Content): BibleId[] =>
  getMissingKeysInObject(bibles as unknown as BibleId[], content);

export const randomGPromise = functions.https.onCall(
  async (): Promise<GPromiseDTO> => {
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
          return gPromise.toDTO();
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
          return gPromise.toDTO();
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
