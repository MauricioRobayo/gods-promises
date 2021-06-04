import axios from "axios";

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

const languageToBibleMap = {
  es: "rvg",
  en: "kjv",
};

const buildPromiseTextFromResponse = (
  bible: string,
  response: ApiResponse
): string => {
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
};

const bibleSuperSearchApi = async (
  language: "en" | "es",
  reference: string
): Promise<string> => {
  const bible = languageToBibleMap[language];
  const {data} = await axios.get(
    `https://api.biblesupersearch.com/api?bible=${bible}&reference=${reference}`
  );
  return buildPromiseTextFromResponse(bible, data);
};

export default bibleSuperSearchApi;
