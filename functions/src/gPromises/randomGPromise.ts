import * as functions from "firebase-functions";
import {updateMissingContent} from "./utils";
import {GPromisesRepository} from "@mauriciorobayo/gods-promises/lib/repositories";
import {GPromiseDTO} from "@mauriciorobayo/gods-promises/lib/models";
import {HttpsError} from "firebase-functions/lib/providers/https";

const gPromisesRepository = new GPromisesRepository(
  functions.config().mongodb.uri
);

export const randomGPromise = functions.https.onCall(
  async (): Promise<GPromiseDTO> => {
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

    throw new HttpsError("internal", "Could not find a random promise");
  }
);
