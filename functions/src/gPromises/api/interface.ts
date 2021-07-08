import {Content} from "@mauriciorobayo/gods-promises/lib/models";
import {BibleId} from "@mauriciorobayo/gods-promises/lib/types";

export interface BibleSearcher {
  getPassageFromReference: (
    bibles: BibleId[],
    reference: string
  ) => Promise<Content>;
}
