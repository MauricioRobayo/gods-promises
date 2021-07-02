import { BibleId, Bibles } from "../types";

type Passage = {
  text: string;
  reference: string;
};

export type Content = Partial<Record<BibleId, Passage & { apiUrl: string }>>;

type DTOContent = Record<
  BibleId,
  Passage & {
    bibleName: string;
  }
>;

export type Source = {
  [key: string]: string;
};

export type GPromiseDTO = {
  id: string;
  source: Source;
  content: DTOContent;
};

export type IGPromise = {
  niv: string;
  source: Source;
  content?: Content;
  pubId: string;
};

export class GPromise {
  niv: string;
  source: Source;
  content: Content;
  pubId: string;

  constructor(
    { niv, source, pubId, content = {} }: IGPromise,
    private bibles: Bibles
  ) {
    this.niv = niv;
    this.source = source;
    this.content = content;
    this.pubId = pubId;
  }

  toDTO(): GPromiseDTO {
    const content = Object.fromEntries(
      Object.entries(this.content).map(([bibleId, content]) => {
        if (!content) {
          throw new Error(
            "GPromise.toDTO: cannot return DTO with missing content!"
          );
        }
        return [
          bibleId,
          {
            text: content.text,
            reference: content.reference,
            bibleName: this.bibles[bibleId as BibleId].name,
          },
        ];
      })
    ) as DTOContent;

    return {
      id: this.pubId,
      source: this.source,
      content,
    };
  }
}
