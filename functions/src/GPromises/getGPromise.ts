import * as functions from "firebase-functions";
import {GPromiseDTO} from "../models/GPromise";
import {HttpsError} from "firebase-functions/lib/providers/https";
import {getGPromiseById} from "../queries";

// TODO: Move humanReadableReference to scrappers, when we get the data. Avoids an extra step here, avoids bundling osisToEn package, and avoids inserting invalid docs.
// TODO: Include bible name on Content.

export const getGPromise = functions.https.onCall(
  async ({gPromiseId}: {gPromiseId: string}): Promise<GPromiseDTO> => {
    const gPromise = await getGPromiseById(gPromiseId);

    if (!gPromise) {
      throw new HttpsError(
        "not-found",
        `No promise with id '${gPromiseId}' found!`
      );
    }

    return gPromise.toDTO();
  }
);
