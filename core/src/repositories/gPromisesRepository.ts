import { G_PROMISES_COLLECTION } from "../config";
import { IGPromise } from "../models";
import { GenericRepository } from "./genericRepository";

export class GPromisesRepository extends GenericRepository<IGPromise> {
  constructor(mongodbUri = "mongo://localhost:27017") {
    super(mongodbUri, G_PROMISES_COLLECTION);
  }
}
