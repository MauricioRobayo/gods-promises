import {
  bibles,
  G_PROMISES_COLLECTION,
} from "@mauriciorobayo/gods-promises/lib/config";
import {GPromise, IGPromise} from "@mauriciorobayo/gods-promises/lib/models";

import {getMongoDbCollection} from "../utils";

const getRandomPromises = async (size: number): Promise<GPromise[]> => {
  const collection = await getMongoDbCollection<IGPromise>(
    G_PROMISES_COLLECTION
  );
  const cursor = collection.aggregate<IGPromise>([
    {$match: {failed: {$exists: false}}},
    {$sample: {size}},
  ]);
  const promises = await cursor.toArray();
  return promises.map((promise) => new GPromise(promise, bibles));
};

export default getRandomPromises;
