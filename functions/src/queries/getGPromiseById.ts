import {getMongoDbCollection} from "../helpers";
import {GPromise, IGPromise} from "../models/GPromise";

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
  return new GPromise(promise);
}
