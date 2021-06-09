import {BibleId} from "../types";

export type Content = Partial<
  Record<
    BibleId,
    {
      text: string;
      reference: string;
      failed?: true;
    }
  >
>;

export type GPromiseDTO = {
  id: string;
  source: string;
  content: Content;
};

export type GPromiseOptions = {
  _id: string;
  osis: string;
  originalReference: string;
  source: string;
  content?: Content;
  failed?: true;
};

export default class GPromise {
  _id: string;
  osis: string;
  originalReference: string;
  source: string;
  content?: Content;
  failed?: true;

  constructor({
    _id,
    osis,
    originalReference,
    source,
    content,
    failed,
  }: GPromiseOptions) {
    this._id = _id;
    this.osis = osis;
    this.originalReference = originalReference;
    this.source = source;
    this.content = content;
    this.failed = failed;
  }

  toDTO(): GPromiseDTO {
    return {
      id: this._id,
      source: this.source,
      content: this.content ?? {},
    };
  }
}
