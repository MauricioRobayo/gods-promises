import { IGPromise } from "@mauriciorobayo/gods-promises/lib/models";
import dotenv from "dotenv";
import fs from "fs/promises";
import uniqBy from "lodash/uniqBy";
import { GPromisesRepository } from "@mauriciorobayo/gods-promises/lib/repositories";

dotenv.config();
export async function insertGPromises(
  gPromises: IGPromise[],
  gPromisesRepository: GPromisesRepository
) {
  try {
    const result = await gPromisesRepository.insertMany(gPromises, {
      ordered: false,
    });
    console.log({ insertedCount: result.insertedCount });
    process.exit();
  } catch (err) {
    if (err.code === 11000) {
      const { result } = err.result;
      console.log({
        ok: result.ok,
        writeErrors: result.writeErrors.length,
        insertedIds: result.insertedIds.length,
      });
      process.exit();
    }
    console.error(err);
    process.exit(1);
  }
}

function idGenerator() {
  const usedIds = new Set();

  return function () {
    let id = GPromisesRepository.pubIdGenerator();
    while (usedIds.has(id)) {
      console.log(`Id '${id} already used! Getting a new one...`);
      id = GPromisesRepository.pubIdGenerator();
    }
    usedIds.add(id);
    return id;
  };
}

export async function gPromisesFromFiles(
  files: (string | number)[]
): Promise<IGPromise[]> {
  const getId = idGenerator();

  const data = await Promise.all<Omit<IGPromise, "pubId">>(
    files.map(async (file) => {
      const data = await fs.readFile(String(file), "utf-8");
      return JSON.parse(data);
    })
  );

  return uniqBy(data.flat(), "niv").map((gPromise) => ({
    ...gPromise,
    pubId: getId(),
  }));
}

export async function writeData(
  gPromises: Omit<IGPromise, "pubId">[],
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
