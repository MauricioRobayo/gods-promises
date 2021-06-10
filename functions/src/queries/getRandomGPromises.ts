import {getMongoDbCollection} from "../helpers";
import {GPromise, IGPromise} from "../models/GPromise";

const getRandomPromises = async (size: number): Promise<GPromise[]> => {
  const collection = await getMongoDbCollection<IGPromise>("g-promises");
  const cursor = collection.aggregate<IGPromise>([
    {$match: {failed: {$exists: false}}},
    {$sample: {size}},
  ]);
  const promises = await cursor.toArray();
  return promises.map((promise) => new GPromise(promise));
};

export default getRandomPromises;
