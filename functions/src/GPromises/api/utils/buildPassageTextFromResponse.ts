import {ApiResponse} from "../bibleSuperSearch";

export function buildPassageTextFromResponse(
  bible: string,
  response: ApiResponse
): string {
  const text = response.results
    .map(({verses}, index) => {
      const result = index === 0 ? "" : "…";
      const bibleVerses = Object.values(verses[bible]);
      return bibleVerses
        .map((verse) => {
          const content = Object.values(verse);
          return `${result}${content.map(({text}) => text).join(" ")}`;
        })
        .join(" ")
        .trim();
    })
    .join(" ")
    .trim();
  return text;
}
