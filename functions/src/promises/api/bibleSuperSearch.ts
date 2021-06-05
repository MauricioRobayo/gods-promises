import axios from "axios";
import {ExternalApi, Language} from "./interface";

type ApiResult = {
  verses: {
    [bibleId: string]: {
      [chapter: string]: {
        [verse: string]: {
          id: number;
          book: number;
          chapter: number;
          verse: number;
          text: string;
          italics: string;
          claimed: boolean;
        };
      };
    };
  };
};
type ApiResponse = {
  results: ApiResult[];
};

class BibleSuperSearch implements ExternalApi {
  #languageToBibleMap = {
    es: "rvg",
    en: "kjv",
  };

  async getPassageFromReference(
    language: Language,
    reference: string
  ): Promise<string> {
    const bible = this.#languageToBibleMap[language];
    const {data} = await axios.get(
      `https://api.biblesupersearch.com/api?bible=${bible}&reference=${reference}`
    );
    return this.buildPromiseTextFromResponse(bible, data);
  }

  private buildPromiseTextFromResponse(
    bible: string,
    response: ApiResponse
  ): string {
    return response.results
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
  }
}

export default BibleSuperSearch;
