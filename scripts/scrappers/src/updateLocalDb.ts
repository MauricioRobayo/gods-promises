import yargs from "yargs";
import chalk from "chalk";
import fs from "fs/promises";
import _ from "lodash";
import { nanoid } from "nanoid";
import { getMongoDbCollection, GPromise } from "./helpers";
import { Collection, InsertWriteOpResult, WithId } from "mongodb";

function idGenerator(): string {
  return nanoid(8);
}

function addId(gPromise: GPromise): GPromise & { _id: string } {
  return {
    _id: idGenerator(),
    ...gPromise,
  };
}

function createUniqueIndex(
  collection: Collection<GPromise>,
  field: string
): Promise<string> {
  return collection.createIndex({ [field]: 1 }, { unique: true });
}

async function updateDb(
  gPromises: GPromise[]
): Promise<InsertWriteOpResult<WithId<GPromise>>> {
  const promisesCollection = await getMongoDbCollection<GPromise>({
    mongodbUri: "mongodb://localhost:27017",
    database: "godsPromises",
    collection: "gPromises",
  });
  const index = await createUniqueIndex(promisesCollection, "osis");
  console.log(`Successfully created index ${index}!`);
  return promisesCollection.insertMany(gPromises, { ordered: false });
}

(async () => {
  const args = await Promise.resolve(
    yargs.option("sampleSize", { number: true, default: 5, alias: "s" }).argv
  );

  const { _: files, sampleSize } = args;

  console.log({ files, sampleSize });

  if (files.length === 0) {
    console.error(chalk.bold(chalk.red("ERROR!")), "No files provided!");
    process.exit(1);
  }

  const data = await Promise.all(
    files.map(async (file) => {
      const data = await fs.readFile(String(file), "utf-8");
      return JSON.parse(data);
    })
  );

  const uniques = _.uniqBy(data.flat(), "osis");
  const sample = sampleSize <= 0 ? uniques : _.sampleSize(uniques, sampleSize);

  const gPromises = sample.map(addId);

  try {
    const result = await updateDb(gPromises);
    console.log({ insertedCount: result.insertedCount });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
