import dotenv from "dotenv";
dotenv.config();

import fs from "fs/promises";
import osisToEn from "bible-reference-formatter";
import { nanoid } from "nanoid";
import { MongoClient, Collection, InsertWriteOpResult, WithId } from "mongodb";
import uniqBy from "lodash/uniqBy";
import { IGPromise } from "@mauriciorobayo/gods-promises/lib/models";
import {
  GODS_PROMISES_DATABASE,
  G_PROMISES_COLLECTION,
} from "@mauriciorobayo/gods-promises/lib/config";

const bcv_parser =
  require("bible-passage-reference-parser/js/en_bcv_parser").bcv_parser;

const bcv = new bcv_parser();

export type BaseGPromise = Omit<IGPromise, "_id">;

function isGPromise(gPromise: any): gPromise is BaseGPromise {
  return "niv" in gPromise && "osis" in gPromise && "source" in gPromise;
}

function idGenerator(): string {
  return nanoid(8);
}

function addId(gPromise: BaseGPromise): IGPromise & { _id: string } {
  return {
    _id: idGenerator(),
    ...gPromise,
  };
}

export async function gPromisesFromFiles(files: (string | number)[]) {
  const data = await Promise.all(
    files.map(async (file) => {
      const data = await fs.readFile(String(file), "utf-8");
      return JSON.parse(data);
    })
  );

  return uniqBy(data.flat(), "osis").map(addId);
}

function createUniqueIndex(
  collection: Collection<IGPromise>,
  field: string
): Promise<string> {
  return collection.createIndex({ [field]: 1 }, { unique: true });
}

export async function updateDb(
  gPromises: IGPromise[],
  mongodbUri: string
): Promise<InsertWriteOpResult<WithId<IGPromise>>> {
  const promisesCollection = await getMongoDbCollection<IGPromise>({
    mongodbUri,
    database: GODS_PROMISES_DATABASE,
    collection: G_PROMISES_COLLECTION,
  });
  const index = await createUniqueIndex(promisesCollection, "osis");
  console.log(`Successfully created index ${index}!`);
  return promisesCollection.insertMany(gPromises, { ordered: false });
}

export async function writeData(
  gPromises: BaseGPromise[],
  filename: string
): Promise<void> {
  const dataDir = `${__dirname}/scrapped-data`;
  const filePath = `${dataDir}/${filename}`;

  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(gPromises));
    console.log(`wrote ${gPromises.length} promises to ${filePath}`);
  } catch (err) {
    console.log(`writeData: ${JSON.stringify(err)}`);
  }
}

export async function getMongoDbCollection<T>({
  mongodbUri,
  database,
  collection,
}: {
  mongodbUri: string;
  database: string;
  collection: string;
}): Promise<Collection<T>> {
  const client = new MongoClient(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(database);
  return db.collection<T>(collection);
}

export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i + 1);
    [array[i], array[randomPosition]] = [array[randomPosition], array[i]];
  }
  return array;
}

export function osisToNivLong(osis: string): string {
  return osisToEn("niv-long", osis);
}

export function makeGPromise({
  reference,
  source,
}: {
  reference: string;
  source: string;
}): BaseGPromise | null {
  try {
    const osis: string = bcv.parse(reference).osis();
    const niv = osisToNivLong(osis);
    if (!niv.includes(":")) {
      console.log(`Skipping '${niv}', full chapter and no specific verses.`);
      return null;
    }
    return {
      niv,
      osis,
      source,
    };
  } catch (err) {
    console.log(`makePromise failed on reference '${reference}'`, err);
    return null;
  }
}

export function getReferences(data: string, source: string): BaseGPromise[] {
  const refs: string[] = bcv.parse(data).osis().split(",");
  const promises = refs
    .map((reference) =>
      makeGPromise({
        reference,
        source,
      })
    )
    .filter(isGPromise);
  return promises;
}
