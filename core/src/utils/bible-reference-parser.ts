import osisToEn from "bible-reference-formatter";
import { IGPromise } from "../models";
const bcv_parser =
  require("bible-passage-reference-parser/js/en_bcv_parser").bcv_parser;

const bcv = new bcv_parser();

export function getReference(text: string): string[] {
  try {
    const osis: string = bcv.parse(text).osis();

    if (osis === "") {
      return [];
    }

    const osisRefs = osis.split(",");

    const nivRefs = osisRefs
      .map(osisToNivLong)
      .filter((niv) => niv.includes(":"));

    return nivRefs;
  } catch (e) {
    console.log(`getReference failed on reference '${text}`);
    return [];
  }
}

function osisToNivLong(osis: string): string {
  return osisToEn("niv-long", osis);
}

export function isGPromise(gPromise: any): gPromise is IGPromise {
  return (
    typeof gPromise?.niv === "string" &&
    typeof gPromise?.osis === "string" &&
    typeof gPromise?.source === "object"
  );
}
