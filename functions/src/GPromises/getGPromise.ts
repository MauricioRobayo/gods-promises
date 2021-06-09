import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import GPromise, {GPromiseDTO} from "../models/GPromise";
import {getMongoDbCollection} from "../helpers";
import {HttpsError} from "firebase-functions/lib/providers/https";

admin.initializeApp();

export const getGPromise = functions.https.onCall(
  async (gPromiseId: string): Promise<GPromiseDTO> => {
    const promisesCollection = await getMongoDbCollection("g-promises");
    const gPromise = await promisesCollection.findOne({_id: gPromiseId});

    if (!gPromise) {
      throw new HttpsError(
        "not-found",
        `Could not found promise with id '${gPromiseId}'!`
      );
    }

    return new GPromise(gPromise).toDTO();
  }
);
