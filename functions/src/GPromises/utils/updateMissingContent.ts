import {GPromise, IGPromise} from "@mauriciorobayo/gods-promises/lib/models";
import {bibleIds, bibles} from "@mauriciorobayo/gods-promises/lib/config";
import {BibleSuperSearch} from "../api";
import {translateReference, getMissingBibles} from ".";
import {getMongoDbCollection} from "../../utils";
import {formatPassage} from "./formatPassage";

const bibleSuperSearch = new BibleSuperSearch({
  bibles,
  translator: translateReference,
  formatter: formatPassage,
});
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
