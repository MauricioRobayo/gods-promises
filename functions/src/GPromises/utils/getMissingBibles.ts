import difference from "lodash/difference";
import {bibleIds} from "../../config";
import {Content} from "../../models/GPromise";
import {BibleIds, BibleId} from "../../types";

function isBibleIdArray(arr: any[]): arr is BibleId[] {
  return arr.every((el) => bibleIds.includes(el));
}

export function getMissingBibles(
  bibles: BibleIds,
  content: Content
): BibleId[] {
  const bibleIds = Object.keys(content);
  if (!isBibleIdArray(bibleIds)) {
    throw new Error(`getMissingBibles: ${bibles} is not a BibleId array!`);
  }
  return difference<BibleId>(bibles, bibleIds);
}
