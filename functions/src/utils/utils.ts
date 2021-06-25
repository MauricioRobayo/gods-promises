import {
  GODS_PROMISES_DATABASE,
  G_PROMISES_COLLECTION,
} from "@mauriciorobayo/gods-promises/lib/config";
import {IGPromise} from "@mauriciorobayo/gods-promises/lib/models";
import * as functions from "firebase-functions";
import {MongoClient, Collection} from "mongodb";

export async function getMongoDbCollection<T>(
  collection: string
): Promise<Collection<T>> {
  const {mongodb} = functions.config();
  const client = new MongoClient(mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(GODS_PROMISES_DATABASE);
  return db.collection<T>(collection);
}

export async function getGPromisesCollection(): Promise<Collection<IGPromise>> {
  return getMongoDbCollection<IGPromise>(G_PROMISES_COLLECTION);
}
