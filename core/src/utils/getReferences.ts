import { BaseGPromise, makeGPromise } from "./makeGPromise";
const bcv_parser =
  require("bible-passage-reference-parser/js/en_bcv_parser").bcv_parser;

const bcv = new bcv_parser();

function isGPromise(gPromise: any): gPromise is BaseGPromise {
  return (
    typeof gPromise?.niv === "string" &&
    typeof gPromise?.osis === "string" &&
    typeof gPromise?.source === "string"
  );
}

export function getReferences(data: string, source: string): BaseGPromise[] {
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
