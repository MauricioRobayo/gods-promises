import {getGPromisesCollection} from "../utils";
import {GPromise} from "@mauriciorobayo/gods-promises/lib/models";
import {bibles} from "@mauriciorobayo/gods-promises/lib/config";

export default async function getGPromiseById(
  id: string
): Promise<GPromise | null> {
  const gPromisesCollection = await getGPromisesCollection();
  const promise = await gPromisesCollection.findOne({_id: id});
  if (!promise) {
    return null;
  }
  return new GPromise(promise, bibles);
}
