import {GPromise, IGPromise} from "../../models/GPromise";
import {bibleIds, bibles} from "../../config";
import {BibleSuperSearch} from "../api";
import {Collection} from "mongodb";
import {translator, getMissingBibles} from ".";

export const updateMissingContent = async (
  gPromise: GPromise,
  gPromisesCollection: Collection<IGPromise>
): Promise<GPromise> => {
  const bibleSuperSearch = new BibleSuperSearch(bibles, translator);
  const missingBibleIds = getMissingBibles(bibleIds, gPromise.content);

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
