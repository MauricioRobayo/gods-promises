import { IGPromise } from "@mauriciorobayo/gods-promises/lib/models";
import { GPromisesRepository } from "@mauriciorobayo/gods-promises/lib/repositories";

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
