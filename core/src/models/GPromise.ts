import { BibleId, Bibles } from "../types";

type Passage = {
  text: string;
  reference: string;
};

export type Content = Partial<Record<BibleId, Passage & { apiUrl: string }>>;

export type GPromiseDTO = {
  id: string;
  source: string;
  content: Record<BibleId, Passage & { bibleName: string }>;
};

export type IGPromise = {
  _id: string;
  osis: string;
  niv: string;
  source: string;
  content?: Content;
};

export class GPromise {
  _id: string;
  osis: string;
  niv: string;
  source: string;
  content: Content;

  constructor(
    { _id, osis, niv, source, content = {} }: IGPromise,
    private bibles: Bibles
  ) {
    this._id = _id;
    this.osis = osis;
    this.niv = niv;
    this.source = source;
    this.content = content;
  }

  toDTO(): GPromiseDTO {
    const content = Object.entries(this.content).reduce(
      (acc, [bibleId, content]) => {
        if (!content) {
          throw new Error(
            "GPromise.toDTO: cannot return DTO with missing content!"
          );
        }
        acc[bibleId as BibleId] = {
          text: content.text,
          reference: content.reference,
          bibleName: this.bibles[bibleId as BibleId].name,
        };
        return acc;
      },
      {} as GPromiseDTO["content"]
    );

    return {
      id: this._id,
      source: this.source,
      content,
    };
  }
}
