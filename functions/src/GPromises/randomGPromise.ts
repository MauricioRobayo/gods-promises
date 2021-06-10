import * as functions from "firebase-functions";
import {getMongoDbCollection} from "../utils";
import {updateMissingContent} from "./utils";
import {getRandomPromises} from "../queries";
import {GPromiseDTO, IGPromise} from "../models/GPromise";

export const randomGPromise = functions.https.onRequest(
  async (_req: functions.Request, res: functions.Response<GPromiseDTO>) => {
    const gPromisesCollection = await getMongoDbCollection<IGPromise>(
      "g-promises"
    );
    const randomGPromises = await getRandomPromises(100);

    for (const randomGPromise of randomGPromises) {
      try {
        const updatedPromise = await updateMissingContent(
          randomGPromise,
          gPromisesCollection
        );
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
