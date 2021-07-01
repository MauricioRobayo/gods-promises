import { BibleId, Bibles } from "../types";
import { WithId, ObjectId } from "mongodb";

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

export type GPromiseDTO = {
  id: string;
  source: string;
  content: DTOContent;
};

export type IGPromise = {
  osis: string;
  niv: string;
  source: string;
  content?: Content;
  pubId: string;
};

export class GPromise {
  private _id: ObjectId;
  osis: string;
  niv: string;
  source: string;
  content: Content;
  pubId: string;

  constructor(
    { _id, osis, niv, source, pubId, content = {} }: WithId<IGPromise>,
    private bibles: Bibles
  ) {
    this._id = _id;
    this.osis = osis;
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
