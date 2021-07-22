import * as functions from "firebase-functions";
import {updateMissingContent} from "./utils";
import {GPromisesRepository} from "@mauriciorobayo/gods-promises/lib/repositories";
import {GPromiseDTO} from "@mauriciorobayo/gods-promises/lib/models";

const gPromisesRepository = new GPromisesRepository(
  functions.config().mongodb.uri
);

export const randomGPromise = functions.https.onCall(
  async (): Promise<GPromiseDTO | {error: string}> => {
    const randomGPromises = await gPromisesRepository.getRandomPromises(100);

    for (const randomGPromise of randomGPromises) {
      try {
        const updatedPromise = await updateMissingContent(randomGPromise);
        return updatedPromise.toDTO();
      } catch (err) {
        functions.logger.error(
          `Failed updating passage for '${
            randomGPromise.pubId
          }': ${JSON.stringify(err)}`
        );
        await gPromisesRepository.updateOne(
          {pubId: randomGPromise.pubId},
          {
            $set: {
              failed: true,
            },
          }
        );
      }
    }

    return {
      error: "Could not get a random promise",
    };
  }
);
