import {Lang, BibleId} from "./types";

export const bibles: Record<BibleId, {lang: Lang}> = {
  kjv: {
    lang: "en",
  },
  rvg: {
    lang: "es",
  },
};

export const biblesIds = Object.keys(bibles);
