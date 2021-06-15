import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { BibleId } from "../gPromises/gPromisesSlice";

export const DEFAULT_LANG = "en";
export const lngs: Record<string, { nativeName: string; bibleId: BibleId }> = {
  en: { nativeName: "English", bibleId: "kjv" },
  es: { nativeName: "Español", bibleId: "rvg" },
};
export const supportedLngs = Object.keys(lngs);

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === "development",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    keySeparator: false,
    supportedLngs,
    detection: {
      order: ["path", "localStorage", "navigator"],
    },
  });

export default i18n;
