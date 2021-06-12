import {bibles} from "../config";
import {GPromise, IGPromise} from "../models/GPromise";
import {getMongoDbCollection} from "../utils";

const getRandomPromises = async (size: number): Promise<GPromise[]> => {
  const collection = await getMongoDbCollection<IGPromise>("g-promises");
  const cursor = collection.aggregate<IGPromise>([
    {$match: {failed: {$exists: false}}},
    {$sample: {size}},
  ]);
  const promises = await cursor.toArray();
  return promises.map((promise) => new GPromise(promise, bibles));
};

export default getRandomPromises;
