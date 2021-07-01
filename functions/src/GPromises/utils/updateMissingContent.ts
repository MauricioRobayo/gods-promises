import {GPromise} from "@mauriciorobayo/gods-promises/lib/models";
import {bibleIds, bibles} from "@mauriciorobayo/gods-promises/lib/config";
import {BibleSuperSearch} from "../api";
import {translateReference, getMissingBibles} from ".";
import {getGPromisesCollection} from "../../utils";
import {formatPassage} from "./formatPassage";

const bibleSuperSearch = new BibleSuperSearch({
  bibles,
  translator: translateReference,
  formatter: formatPassage,
});
const collection = getGPromisesCollection();

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
    {pubId: gPromise.pubId},
    {
      $set: {
        content: newContent,
      },
    }
  );
  gPromise.content = newContent;
  return gPromise;
};
