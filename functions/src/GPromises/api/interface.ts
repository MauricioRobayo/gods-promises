import {Content} from "../../models/GPromise";
import {BibleId} from "../../types";

export function ok<T>(data: T): Success<T> {
  return {
    isError: false,
    data,
  };
}

export function err(err: string): Error {
  return {
    isError: true,
    error: err,
  };
}

type Success<T> = {
  isError: false;
  data: T;
};
type Error = {
  isError: true;
  error: string;
};

export type SuccessOrError<T> = Success<T> | Error;

export interface BibleSearcher {
  getPassageFromReference: (
    bibles: BibleId[],
    reference: string
  ) => Promise<Content>;
}
