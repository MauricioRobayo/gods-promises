import dotenv from "dotenv";
dotenv.config();

import fs from "fs/promises";
import { Collection, MongoClient } from "mongodb";
import osisToEn from "bible-reference-formatter";
const bcv_parser =
  require("bible-passage-reference-parser/js/en_bcv_parser").bcv_parser;

const bcv = new bcv_parser();

type GPromise = {
  niv: string;
  osis: string;
  source: string;
};
function isGPromise(gPromise: any): gPromise is GPromise {
  return "niv" in gPromise && "osis" in gPromise && "source" in gPromise;
}

export async function writeData(
  gPromises: GPromise[],
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
}): GPromise | null {
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

export function getReferences(data: string, source: string): GPromise[] {
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
