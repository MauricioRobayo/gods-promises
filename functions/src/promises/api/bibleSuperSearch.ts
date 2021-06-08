import axios from "axios";
import {logger} from "firebase-functions";
import {BibleId, QueryResponse} from "../../types";
import {ExternalApi} from "./interface";

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
  ): Promise<QueryResponse> {
    try {
      const {data} = await axios.get(
        `https://api.biblesupersearch.com/api?bible=${bibleId}&reference=${reference}`
      );
      return {
        status: "success",
        text: this.buildPromiseTextFromResponse(bibleId, data),
      };
    } catch (err) {
      if (err.response) {
        return {
          status: "error",
          errors: err.response.data.errors,
        };
      }
      logger.error(
        `BibleSuperSearch.getPassageFromReference error${err.message}`
      );
      throw new Error(`Failed to retrieve '${reference}' from ${bibleId}!`);
    }
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
