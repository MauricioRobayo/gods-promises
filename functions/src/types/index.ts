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
export interface IGPromise {
  _id: string;
  osis: string;
  originalReference: string;
  source: string;
}
export interface ISuccessfulGPromise extends IGPromise {
  content: Content;
}
export interface IFailedGPromise extends IGPromise {
  errors: string[];
}
export type IPromise = ISuccessfulGPromise | IFailedGPromise;
