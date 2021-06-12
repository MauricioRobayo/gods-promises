import {ApiResponse} from "../bibleSuperSearch";

export function buildPassageTextFromResponse(
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
        .join("\n")
        .trim();
    })
    .join("\n")
    .trim();
  return text;
}
