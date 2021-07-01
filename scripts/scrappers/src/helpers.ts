import { IGPromise } from "@mauriciorobayo/gods-promises/lib/models";
import dotenv from "dotenv";
import fs from "fs/promises";
import uniqBy from "lodash/uniqBy";
dotenv.config();

export async function gPromisesFromFiles(
  files: (string | number)[]
): Promise<IGPromise[]> {
  const data = await Promise.all(
    files.map(async (file) => {
      const data = await fs.readFile(String(file), "utf-8");
      return JSON.parse(data);
    })
  );

  return uniqBy(data.flat(), "osis");
}

export async function writeData(
  gPromises: IGPromise[],
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
