import dotenv from "dotenv";
import yargs from "yargs";
import { gPromisesFromFiles } from "./helpers";
import { GPromisesRepository } from "@mauriciorobayo/gods-promises/lib/repositories";
import { insertGPromises } from "./insertPromises";

dotenv.config();

(async () => {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    console.error("MONGODB_URI is missing!");
    process.exit(1);
  }

  const gPromisesRepository = new GPromisesRepository(mongodbUri);

  const args = await Promise.resolve(
    yargs
      .option("careful", { string: true, choices: ["yes"] })
      .demandOption("careful").argv
  );

  const { _: files } = args;

  if (files.length === 0) {
    console.error("ERROR! No files provided.");
    process.exit(1);
  }

  const gPromises = await gPromisesFromFiles(files);

  await insertGPromises(gPromises, gPromisesRepository);
})();
