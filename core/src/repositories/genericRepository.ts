import {
  MongoClient,
  OptionalId,
  InsertWriteOpResult,
  WithId,
  CollectionInsertManyOptions,
} from "mongodb";
import { GODS_PROMISES_DATABASE } from "../config";

export interface IRepository<T> {
  insertMany: (
    data: OptionalId<T>[],
    options: CollectionInsertManyOptions
  ) => Promise<InsertWriteOpResult<WithId<T>>>;
}

export class GenericRepository<T> implements IRepository<T> {
  private client: Promise<MongoClient>;
  constructor(
    mongodbUri: string = "mongodb://localhost:27017",
    private collection: string
  ) {
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

  protected async getCollection() {
    const client = await this.client;
    const db = client.db(GODS_PROMISES_DATABASE);
    return db.collection<T>(this.collection);
  }
}
