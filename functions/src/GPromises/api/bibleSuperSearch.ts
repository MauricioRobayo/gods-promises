import axios from "axios";
import {Content} from "../../models/GPromise";
import {BibleId, Bibles, Lang} from "../../types";
import {BibleSearcher} from "./interface";
import {buildPassageTextFromResponse} from "./utils";

type ApiResult = {
  verses: {
    [bibleId: string]: {
      [chapter: string]: {
        [verse: string]: {
          book: number;
          text: string;
        };
      };
    };
  };
};
export type ApiResponse = {
  results: ApiResult[];
};

class BibleSuperSearch implements BibleSearcher {
  constructor(
    private bibles: Bibles,
    private translator: (lang: Lang, reference: string) => string
  ) {}
  async getPassageFromReference(
    bibles: BibleId[],
    reference: string
  ): Promise<Content> {
    const {data} = await axios.get(
      `https://api.biblesupersearch.com/api?bible=${JSON.stringify(
        bibles
      )}&reference=${reference}`
    );
    const c: Content = {};
    const content = bibles.reduce((acc, curr) => {
      acc[curr] = {
        text: buildPassageTextFromResponse(curr, data),
        reference: this.translator(this.bibles[curr].lang, reference),
      };
      return acc;
    }, c);
    return content;
  }
}

export default BibleSuperSearch;
