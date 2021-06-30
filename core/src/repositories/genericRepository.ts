import { MongoClient, OptionalId, InsertWriteOpResult, WithId } from "mongodb";
import { GODS_PROMISES_DATABASE } from "../config";

export interface IRepository<T> {
  insertMany: (
    data: OptionalId<T>[]
  ) => Promise<InsertWriteOpResult<WithId<T>>>;
}

export class GenericRepository<T> implements IRepository<T> {
  private client: Promise<MongoClient>;
  constructor(
    mongodbUri: string = "mongo://localhost:27017",
    private collection: string
  ) {
    const client = new MongoClient(mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.client = client.connect();
  }

  async insertMany(
    data: OptionalId<T>[]
  ): Promise<InsertWriteOpResult<WithId<T>>> {
    const client = await this.client;
    const db = client.db(GODS_PROMISES_DATABASE);
    const collection = db.collection<T>(this.collection);
    return collection.insertMany(data, { ordered: false });
  }
}
