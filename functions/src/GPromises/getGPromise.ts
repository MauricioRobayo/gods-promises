import * as functions from "firebase-functions";
import {GPromiseDTO} from "../models/GPromise";
import {HttpsError} from "firebase-functions/lib/providers/https";
import {getGPromiseById} from "../queries";
import {updateMissingContent} from "./utils";

export const getGPromise = functions.https.onCall(
  async (gPromiseId: string): Promise<GPromiseDTO> => {
    const gPromise = await getGPromiseById(gPromiseId);

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
