import yargs from "yargs";
import sampleSize from "lodash/sampleSize";
import { gPromisesFromFiles } from "./helpers";
import { GPromisesRepository } from "@mauriciorobayo/gods-promises/lib/repositories";

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

  try {
    const result = await gPromisesRepository.insertMany(sample, {
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
})();
