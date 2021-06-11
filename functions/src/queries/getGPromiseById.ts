import {getMongoDbCollection} from "../utils";
import {GPromise, IGPromise} from "../models/GPromise";
import {bibles} from "../config";

export default async function getGPromiseById(
  id: string
): Promise<GPromise | null> {
  const promisesCollection = await getMongoDbCollection<IGPromise>(
    "g-promises"
  );
  const promise = await promisesCollection.findOne({_id: id});
  if (!promise) {
    return null;
  }
  return new GPromise(promise, bibles);
}
