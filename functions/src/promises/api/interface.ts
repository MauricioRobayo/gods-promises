import {BibleId, QueryResponse} from "../../types";

export interface ExternalApi {
  getPassageFromReference: (
    bibleId: BibleId,
    reference: string
  ) => Promise<QueryResponse>;
}
