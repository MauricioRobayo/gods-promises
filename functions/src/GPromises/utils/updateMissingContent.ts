import {GPromise, IGPromise} from "../../models/GPromise";
import {bibleIds, bibles} from "../../config";
import {BibleSuperSearch} from "../api";
import {translator, getMissingBibles} from ".";
import {getMongoDbCollection} from "../../utils";

const bibleSuperSearch = new BibleSuperSearch(bibles, translator);
const collection = getMongoDbCollection<IGPromise>("g-promises");

export const updateMissingContent = async (
  gPromise: GPromise
): Promise<GPromise> => {
  const missingBibleIds = getMissingBibles(bibleIds, gPromise.content);
  const gPromisesCollection = await collection;

  if (missingBibleIds.length === 0) {
    return gPromise;
  }

  const content = await bibleSuperSearch.getPassageFromReference(
    missingBibleIds,
    gPromise.niv
  );
  const newContent = gPromise.content
    ? {
        ...gPromise.content,
        ...content,
      }
    : content;
  await gPromisesCollection.updateOne(
    {_id: gPromise._id},
    {
      $set: {
        content: newContent,
      },
    }
  );
  gPromise.content = newContent;
  return gPromise;
};