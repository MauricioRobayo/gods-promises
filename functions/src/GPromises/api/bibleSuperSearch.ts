import axios from "axios";
import {Content} from "../../models/GPromise";
import {BibleId, Bibles, Lang} from "../../types";
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
    const {data} = await axios.get(
      `https://api.biblesupersearch.com/api?bible=${JSON.stringify(
        bibles
      )}&reference=${reference.replace(/–/g, "-")}`
    );
    const content = bibles.reduce((acc, curr) => {
      acc[curr] = {
        text: this.formatter(buildPassageTextFromResponse(curr, data)),
        reference: this.translator(this.bibles[curr].lang, reference),
      };
      return acc;
    }, {} as Content);
    return content;
  }
}

export default BibleSuperSearch;
