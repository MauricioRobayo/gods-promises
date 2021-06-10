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
  const db = client.db(mongodb.database);
  return db.collection<T>(collection);
}
