import yargs from "yargs";
import sampleSize from "lodash/sampleSize";
import { gPromisesFromFiles } from "./helpers";
import { GPromisesRepository } from "@mauriciorobayo/gods-promises/lib/repositories";
import { insertGPromises } from "./updateProdDb";

const gPromisesRepository = new GPromisesRepository();

(async () => {
  const args = await Promise.resolve(
    yargs.option("sampleSize", { number: true, default: 5, alias: "s" }).argv
  );

  const { _: files, sampleSize: n } = args;

  console.log({ files, n });

  if (files.length === 0) {
    console.error("ERROR! No files provided.");
    process.exit(1);
  }

  const gPromises = await gPromisesFromFiles(files);

  const sample = n <= 0 ? gPromises : sampleSize(gPromises, n);

  await insertGPromises(sample, gPromisesRepository);
})();
