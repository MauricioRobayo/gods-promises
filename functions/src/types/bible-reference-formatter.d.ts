declare module "bible-reference-formatter" {
  type Style =
    | "esv-long"
    | "esv-short"
    | "niv-long"
    | "niv-short"
    | "niv-shortest"
    | "nlt-long"
    | "nlt-short";
  const osisToEn: (style: Style, osis: string, context?: string) => string;
  export = osisToEn;
}
