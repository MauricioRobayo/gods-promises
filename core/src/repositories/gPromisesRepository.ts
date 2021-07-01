import {
  CollectionInsertManyOptions,
  InsertWriteOpResult,
  WithId,
} from "mongodb";
import { nanoid } from "nanoid";
import { G_PROMISES_COLLECTION } from "../config";
import { IGPromise } from "../models";
import { GenericRepository } from "./genericRepository";

export class GPromisesRepository extends GenericRepository<IGPromise> {
  constructor(mongodbUri = "mongodb://localhost:27017") {
    super(mongodbUri, G_PROMISES_COLLECTION);
  }

  async insertMany(
    data: IGPromise[],
    options: CollectionInsertManyOptions = {}
  ): Promise<InsertWriteOpResult<WithId<IGPromise>>> {
    return super.insertMany(data, options) as Promise<
      InsertWriteOpResult<WithId<IGPromise>>
    >;
  }

  static generatePubId(): string {
    return nanoid(8);
  }
}
