import axios from "axios";
import {Content} from "@mauriciorobayo/gods-promises/lib/models";
import {BibleId, Bibles, Lang} from "@mauriciorobayo/gods-promises/lib/types";
import {BibleSearcher} from "./interface";
import {buildPassageTextFromResponse} from "./utils";

type Translator = (lang: Lang, reference: string) => string;
type Formatter = (text: string) => string;
type ApiResult = {
  verses: {
    [bibleId: string]: {
      [chapter: string]: {
        [verse: string]: {
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
  private bibles: Bibles;
  private formatter: Formatter;
  private translator: Translator;
  constructor({
    bibles,
    formatter,
    translator,
  }: {
    bibles: Bibles;
    formatter: Formatter;
    translator: Translator;
  }) {
    this.bibles = bibles;
    this.formatter = formatter;
    this.translator = translator;
  }
  async getPassageFromReference(
    bibles: BibleId[],
    reference: string
  ): Promise<Content> {
    // We need to convert en-dash to hyphen so the API can understand the reference.
    // https://github.com/MauricioRobayo/promesas/issues/10#issue-919895469
    const referenceWithHyphen = reference.replace(/–/g, "-");
    const apiUrl = `https://api.biblesupersearch.com/api?bible=${JSON.stringify(
      bibles
    )}&reference=${referenceWithHyphen}`;
    const {data} = await axios.get(apiUrl);
    const content = bibles.reduce((acc, curr) => {
      acc[curr] = {
        text: this.formatter(buildPassageTextFromResponse(curr, data)),
        reference: this.translator(this.bibles[curr].lang, reference),
        apiUrl,
      };
      return acc;
    }, {} as Content);
    return content;
  }
}

export default BibleSuperSearch;
