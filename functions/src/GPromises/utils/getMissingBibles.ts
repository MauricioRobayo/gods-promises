import {Content} from "../../models/GPromise";
import {BibleIds, BibleId} from "../../types";

export function getMissingKeysInObject<T extends string>(
  ids: T[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any> = {}
): T[] {
  const objectKeys = Object.keys(content);
  const missingKeys = [];
  for (const key of ids) {
    if (!objectKeys.includes(key)) {
      missingKeys.push(key);
    }
  }
  return missingKeys;
}

export const getMissingBibles = (
  bibles: BibleIds,
  content: Content
): BibleId[] => getMissingKeysInObject(bibles as unknown as BibleId[], content);
