import axios from "axios";
import {ExternalApi, BibleId} from "./interface";

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
  async getPassageFromReference(
    bibleId: BibleId,
    reference: string
  ): Promise<string> {
    const {data} = await axios.get(
      `https://api.biblesupersearch.com/api?bible=${bibleId}&reference=${reference}`
    );
    return this.buildPromiseTextFromResponse(bibleId, data);
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
      .join("\n")
      .replace("¶", "")
      .trim();
  }
}

export default BibleSuperSearch;
