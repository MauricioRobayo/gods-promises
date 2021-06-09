import {bibles, bibleIds, langs} from "../config";

export type BibleIds = typeof bibleIds;
export type Bibles = typeof bibles;
export type BibleId = typeof bibleIds[number];
export type Lang = typeof langs[number];
