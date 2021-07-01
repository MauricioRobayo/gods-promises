import { nanoid } from "nanoid";
import { bibles, G_PROMISES_COLLECTION } from "../config";
import { IGPromise } from "../models";
import { GenericRepository } from "./genericRepository";
import { GPromise } from "../models";

export class GPromisesRepository extends GenericRepository<IGPromise> {
  constructor(mongodbUri = "mongodb://localhost:27017") {
    super(mongodbUri, G_PROMISES_COLLECTION);
  }

  async getGPromiseById(id: string): Promise<GPromise | null> {
    const collection = await this.getCollection();

    const promise = await collection.findOne({
      pubId: id,
    });
    if (!promise) {
      return null;
    }
    return new GPromise(promise, bibles);
  }

  async getRandomPromises(size: number): Promise<GPromise[]> {
    const collection = await this.getCollection();
    const cursor = collection.aggregate<IGPromise>([
      { $match: { failed: { $exists: false } } },
      { $sample: { size } },
    ]);
    const promises = await cursor.toArray();
    return promises.map((promise) => new GPromise(promise, bibles));
  }

  async generatePubId(): Promise<string> {
    const id = nanoid(8);
    const gPromise = await this.getGPromiseById(id);

    if (!gPromise) {
      return id;
    }

    return this.generatePubId();
  }
}
