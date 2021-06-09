import {Lang, BibleId} from "./types";

export const bibles: Record<BibleId, {lang: Lang; name: string}> = {
  kjv: {
    lang: "en",
    name: "Authorized King James Version",
  },
  rvg: {
    lang: "es",
    name: "Reina Valera Gómez",
  },
};
export const bibleIds = ["kjv", "rvg"] as const;
export const langs = ["en", "es"] as const;
