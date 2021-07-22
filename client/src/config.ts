import { BibleId } from "@mauriciorobayo/gods-promises/lib/types";

export type Locale = "en" | "es";
export const localeInfo: Record<string, { name: string; bibleId: BibleId }> = {
  en: { name: "English", bibleId: "kjv" },
  es: { name: "Español", bibleId: "rvg" },
};
