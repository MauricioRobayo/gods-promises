import { nanoid } from "nanoid";
import { bibles, G_PROMISES_COLLECTION } from "../config";
import { IGPromise } from "../models";
import { GenericRepository } from "./genericRepository";
import { GPromise } from "../models";

export class GPromisesRepository extends GenericRepository<IGPromise> {
  constructor(mongodbUri: string) {
    super(mongodbUri, G_PROMISES_COLLECTION);
  }

  async insertManyAssigningUniquePubId(
    gPromises: Omit<IGPromise, "pubId">[]
  ): Promise<{ insertedIds: string[]; skippedNivs: string[] }> {
    const collection = await this.getCollection();
    const insertedIds: string[] = [];
    const skippedNivs: string[] = [];

    for (const gPromise of gPromises) {
      // TODO: should only insert and check error? Might be faster/better?
      const exists = await collection.findOne({ niv: gPromise.niv });

      if (exists) {
        skippedNivs.push(gPromise.niv);
        continue;
      }

      const pubId = await this.generatePubId();
      const result = await collection.insertOne({
        ...gPromise,
        pubId,
      });
      insertedIds.push(result.insertedId.toHexString());
    }

    return { insertedIds, skippedNivs };
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

  async generatePubId(maxDepth = 10): Promise<string> {
    return await this.generatePubIdHelper(0, maxDepth);
  }

  private async generatePubIdHelper(
    depth: number,
    maxDepth: number
  ): Promise<string> {
    if (depth === maxDepth) {
      throw new Error(
        "GPromisesRepository.generatePubId: maxDepth reached! Could not find available pubId."
      );
    }

    const id = GPromisesRepository.pubIdGenerator();
    const gPromise = await this.getGPromiseById(id);

    if (!gPromise) {
      return id;
    }

    return this.generatePubIdHelper(depth + 1, maxDepth);
  }

  static pubIdGenerator(): string {
    return nanoid(8);
  }

  protected async getCollection() {
    const collection = await super.getCollection();

    if (!collection.indexExists("niv")) {
      collection.createIndex("niv", { unique: true, name: "niv" });
    }

    if (!collection.indexExists("pubId")) {
      collection.createIndex("pubId", { unique: true, name: "pubId" });
    }

    return collection;
  }
}
