import {getMongoDbCollection} from "../utils";
import {GPromise, IGPromise} from "@mauriciorobayo/gods-promises/lib/models";
import {
  bibles,
  G_PROMISES_COLLECTION,
} from "@mauriciorobayo/gods-promises/lib/config";

export default async function getGPromiseById(
  id: string
): Promise<GPromise | null> {
  const promisesCollection = await getMongoDbCollection<IGPromise>(
    G_PROMISES_COLLECTION
  );
  const promise = await promisesCollection.findOne({_id: id});
  if (!promise) {
    return null;
  }
  return new GPromise(promise, bibles);
}
