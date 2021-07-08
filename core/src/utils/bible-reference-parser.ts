import osisToEn from "bible-reference-formatter";
import { IGPromise, Source } from "../models";
const bcv_parser =
  require("bible-passage-reference-parser/js/en_bcv_parser").bcv_parser;

const bcv = new bcv_parser();

export function getReferences(text: string): string[] {
  try {
    const osis: string = bcv.parse(text).osis();

    if (osis === "") {
      return [];
    }

    const osisRefs = new Set(osis.split(","));

    const nivRefs = [...osisRefs]
      .map(osisToNivLong)
      .filter((niv) => niv.includes(":"));

    return nivRefs;
  } catch (e) {
    console.log(`getReference failed on reference '${text}`);
    return [];
  }
}

export function makeGPromises(
  nivReferences: string[],
  source: Source
): Omit<IGPromise, "pubId">[] {
  return nivReferences.map((nivReference) => {
    return {
      niv: nivReference,
      source,
    };
  });
}

function osisToNivLong(osis: string): string {
  return osisToEn("niv-long", osis);
}
