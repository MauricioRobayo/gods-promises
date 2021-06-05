export type Language = "en" | "es";

export interface ExternalApi {
  getPassageFromReference: (
    language: Language,
    reference: string
  ) => Promise<string>;
}
