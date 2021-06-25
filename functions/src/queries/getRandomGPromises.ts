import {bibles} from "@mauriciorobayo/gods-promises/lib/config";
import {GPromise, IGPromise} from "@mauriciorobayo/gods-promises/lib/models";
import {getGPromisesCollection} from "../utils";

const getRandomPromises = async (size: number): Promise<GPromise[]> => {
  const gPromisesCollection = await getGPromisesCollection();
  const cursor = gPromisesCollection.aggregate<IGPromise>([
    {$match: {failed: {$exists: false}}},
    {$sample: {size}},
  ]);
  const promises = await cursor.toArray();
  return promises.map((promise) => new GPromise(promise, bibles));
};

export default getRandomPromises;
