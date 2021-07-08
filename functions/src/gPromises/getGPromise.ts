import * as functions from "firebase-functions";
import {GPromiseDTO} from "@mauriciorobayo/gods-promises/lib/models";
import {HttpsError} from "firebase-functions/lib/providers/https";
import {GPromisesRepository} from "@mauriciorobayo/gods-promises/lib/repositories";
import {updateMissingContent} from "./utils";

const gPromisesRepository = new GPromisesRepository(
  functions.config().mongodb.uri
);

export const getGPromise = functions.https.onCall(
  async (gPromiseId: string): Promise<GPromiseDTO> => {
    const gPromise = await gPromisesRepository.getGPromiseById(gPromiseId);

    if (!gPromise) {
      throw new HttpsError(
        "not-found",
        `No promise with id '${gPromiseId}' found!`
      );
    }

    const updatedPromise = await updateMissingContent(gPromise);
    return updatedPromise.toDTO();
  }
);
