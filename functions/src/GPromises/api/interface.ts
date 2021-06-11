import {Content} from "../../models/GPromise";
import {BibleId} from "../../types";

export interface BibleSearcher {
  getPassageFromReference: (
    bibles: BibleId[],
    reference: string
  ) => Promise<Content>;
}
