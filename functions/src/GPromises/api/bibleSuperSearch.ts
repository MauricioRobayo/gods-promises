import axios from "axios";
import {cleanPassage} from "../../helpers/helpers";
import {Content} from "../../models/GPromise";
import {BibleId, Bibles, Lang} from "../../types";
import {BibleSearcher} from "./interface";

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
type ApiResponse = {
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
        text: this.buildPassageTextFromResponse(curr, data),
        reference: this.translator(this.bibles[curr].lang, reference),
      };
      return acc;
    }, c);
    return content;
  }

  private buildPassageTextFromResponse(
    bible: string,
    response: ApiResponse
  ): string {
    const text = response.results
      .map(({verses}) => {
        const chapters = Object.values(verses[bible]);
        return chapters
          .map((chapter) => {
            const verses = Object.values(chapter);
            return verses.map(({text}) => text).join("\n");
          })
          .join("\n");
      })
      .join("\n");
    return cleanPassage(text);
  }
}

export default BibleSuperSearch;
