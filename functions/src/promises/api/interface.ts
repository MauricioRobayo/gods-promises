export type BibleId = "kjv";

export interface ExternalApi {
  getPassageFromReference: (
    bibleId: BibleId,
    reference: string
  ) => Promise<string>;
}
