import yargs from "yargs";
import _ from "lodash";
import { gPromisesFromFiles, updateDb } from "./helpers";

(async () => {
  const args = await Promise.resolve(
    yargs.option("sampleSize", { number: true, default: 5, alias: "s" }).argv
  );

  const { _: files, sampleSize } = args;

  console.log({ files, sampleSize });

  if (files.length === 0) {
    console.error("ERROR! No files provided.");
    process.exit(1);
  }

  const gPromises = await gPromisesFromFiles(files);

  const sample =
    sampleSize <= 0 ? gPromises : _.sampleSize(gPromises, sampleSize);

  try {
    const result = await updateDb(sample, {
      mongodbUri: "mongodb://localhost:27017",
      database: "godsPromises",
      collection: "gPromises",
    });
    console.log({ insertedCount: result.insertedCount });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
