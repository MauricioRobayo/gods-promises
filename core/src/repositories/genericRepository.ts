import {
  MongoClient,
  OptionalId,
  InsertWriteOpResult,
  WithId,
  CollectionInsertManyOptions,
  FilterQuery,
  UpdateQuery,
  UpdateWriteOpResult,
} from "mongodb";
import { GODS_PROMISES_DATABASE } from "../config";

export interface IRepository<T> {
  insertMany: (
    data: OptionalId<T>[],
    options: CollectionInsertManyOptions
  ) => Promise<InsertWriteOpResult<WithId<T>>>;
}

export class GenericRepository<T> implements IRepository<T> {
  protected client: Promise<MongoClient>;
  constructor(mongodbUri: string, protected collection: string) {
    const client = new MongoClient(mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.client = client.connect();
  }

  async insertMany(
    data: OptionalId<T>[],
    options: CollectionInsertManyOptions = {}
  ): Promise<InsertWriteOpResult<WithId<T>>> {
    const collection = await this.getCollection();
    return collection.insertMany(data, options);
  }

  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<UpdateWriteOpResult> {
    const collection = await this.getCollection();
    return collection.updateOne(filter, update);
  }

  protected async getCollection() {
    const client = await this.client;
    const db = client.db(GODS_PROMISES_DATABASE);
    const collection = db.collection<T>(this.collection);
    return collection;
  }
}
