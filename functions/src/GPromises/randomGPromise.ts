import * as functions from "firebase-functions";
import {getGPromisesCollection} from "../utils";
import {updateMissingContent} from "./utils";
import {getRandomPromises} from "../queries";
import {GPromiseDTO} from "@mauriciorobayo/gods-promises/lib/models";

export const randomGPromise = functions.https.onRequest(
  async (_req: functions.Request, res: functions.Response<GPromiseDTO>) => {
    const gPromisesCollection = await getGPromisesCollection();
    const randomGPromises = await getRandomPromises(100);

    for (const randomGPromise of randomGPromises) {
      try {
        const updatedPromise = await updateMissingContent(randomGPromise);
        res.json(updatedPromise.toDTO());
        return;
      } catch (err) {
        functions.logger.error(
          `Failed updating passages for '${
            randomGPromise._id
          }': ${JSON.stringify(err)}`
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
  }
);
