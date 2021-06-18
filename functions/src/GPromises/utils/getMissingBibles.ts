import difference from "lodash/difference";
import {bibleIds} from "@mauriciorobayo/gods-promises/lib/config";
import {Content} from "@mauriciorobayo/gods-promises/lib/models";
import {BibleIds, BibleId} from "@mauriciorobayo/gods-promises/lib/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
