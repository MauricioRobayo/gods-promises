import { makeGPromise } from "./makeGPromise";
import { IGPromise } from "../models";
const bcv_parser =
  require("bible-passage-reference-parser/js/en_bcv_parser").bcv_parser;

const bcv = new bcv_parser();

function isGPromise(gPromise: any): gPromise is IGPromise {
  return (
    typeof gPromise?.niv === "string" &&
    typeof gPromise?.osis === "string" &&
    typeof gPromise?.source === "string"
  );
}

export function getReferences(data: string, source: string): IGPromise[] {
  const refs: string[] = bcv.parse(data).osis().split(",");
  const promises = refs
    .map((reference) =>
      makeGPromise({
        reference,
        source,
      })
    )
    .filter(isGPromise);
  return promises;
}
