export type QueryResponse =
  | {
      status: "success";
      text: string;
    }
  | {
      status: "error";
      errors: string[];
    };
export type BibleId = "kjv" | "rvg";
export type Content = Record<
  BibleId,
  {
    text: string;
    reference: string;
  }
>;
export interface IBasePromise {
  _id: string;
  osis: string;
  originalReference: string;
  source: string;
}
export interface ISuccessfulPromise extends IBasePromise {
  content: Content;
}
export interface IFailedPromise extends IBasePromise {
  errors: string[];
}
export type IPromise = ISuccessfulPromise | IFailedPromise;
