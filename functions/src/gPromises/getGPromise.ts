import {GPromiseDTO} from "@mauriciorobayo/gods-promises/lib/models";
import {GPromisesRepository} from "@mauriciorobayo/gods-promises/lib/repositories";
import * as functions from "firebase-functions";
import {updateMissingContent} from "./utils";

const gPromisesRepository = new GPromisesRepository(
  functions.config().mongodb.uri
);

export const getGPromise = functions.https.onCall(
  async (gPromiseId: string): Promise<GPromiseDTO> => {
    const gPromise = await gPromisesRepository.getGPromiseById(gPromiseId);

    if (!gPromise) {
      throw new functions.https.HttpsError(
        "not-found",
        `No promise with id '${gPromiseId}' found!`
      );
    }

    const updatedPromise = await updateMissingContent(gPromise);
    return updatedPromise.toDTO();
  }
);
