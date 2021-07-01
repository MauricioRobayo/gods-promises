import osisToEn from "bible-reference-formatter";
import { GPromisesRepository } from "../repositories";
import { IGPromise } from "../models";
const bcv_parser =
  require("bible-passage-reference-parser/js/en_bcv_parser").bcv_parser;

const bcv = new bcv_parser();

function osisToNivLong(osis: string): string {
  return osisToEn("niv-long", osis);
}

function isGPromise(gPromise: any): gPromise is IGPromise {
  return (
    typeof gPromise?.niv === "string" &&
    typeof gPromise?.osis === "string" &&
    typeof gPromise?.source === "string"
  );
}

export function getOsisReference(reference: string): string {
  return bcv.parse(reference).osis();
}

export function getOsisReferences(data: string): string[] {
  return bcv.parse(data).osis().split(",");
}

export function gPromiseFromOsisReference({
  osis,
  source,
}: {
  osis: string;
  source: string;
}): IGPromise | null {
  try {
    const niv = osisToNivLong(osis);
    if (!niv.includes(":")) {
      console.log(`Skipping '${niv}', full chapter and no specific verses.`);
      return null;
    }
    return {
      niv,
      osis,
      source,
      pubId: GPromisesRepository.pubIdGenerator(),
    };
  } catch (err) {
    console.log(`makePromise failed on reference '${osis}'`, err);
    return null;
  }
}

export function gPromisesFromOsisReferences(
  references: string[],
  source: string
): IGPromise[] {
  const gPromises = references.map((reference) =>
    gPromiseFromOsisReference({
      osis: reference,
      source,
    })
  );
  return gPromises.filter(isGPromise);
}
