import * as functions from "firebase-functions";
import {getGPromisesCollection} from "../utils";
import {updateMissingContent} from "./utils";
import {GPromisesRepository} from "@mauriciorobayo/gods-promises/lib/repositories";
import {GPromiseDTO} from "@mauriciorobayo/gods-promises/lib/models";

const gPromisesRepository = new GPromisesRepository();

export const randomGPromise = functions.https.onRequest(
  async (_req: functions.Request, res: functions.Response<GPromiseDTO>) => {
    const gPromisesCollection = await getGPromisesCollection();
    const randomGPromises = await gPromisesRepository.getRandomPromises(100);

    for (const randomGPromise of randomGPromises) {
      try {
        const updatedPromise = await updateMissingContent(randomGPromise);
        res.json(updatedPromise.toDTO());
        return;
      } catch (err) {
        functions.logger.error(
          `Failed updating passages for '${
            randomGPromise.pubId
          }': ${JSON.stringify(err)}`
        );
        await gPromisesCollection.updateOne(
          {pubId: randomGPromise.pubId},
          {
            $set: {
              failed: true,
            },
          }
        );
      }
    }
  }
);
