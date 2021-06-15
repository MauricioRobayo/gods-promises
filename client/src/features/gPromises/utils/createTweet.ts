export const TWEET_MAX_LENGTH = 275;

export function createTweet({
  text,
  reference,
  link = "",
}: {
  text: string;
  reference: string;
  link?: string;
}): string {
  const ellipsisLength = 3; // Seems like twitter counts ellipses as two characters + 1 space
  const twitterLinkWithSpaceLength = 24; // all links are 23 chars on twitter + 1 space
  const linkWithSpace = link ? ` ${link}` : "";
  const baseTweet = `${text} -${reference}`;
  const occurrencesOfEllipses = occurrencesOfCharacterInString("…", baseTweet);
  const tweetLength =
    baseTweet.length +
    occurrencesOfEllipses +
    (link ? twitterLinkWithSpaceLength : 0);
  if (tweetLength > TWEET_MAX_LENGTH) {
    const extraLength = tweetLength - TWEET_MAX_LENGTH;
    const indexToTrimAt = text.length - extraLength - ellipsisLength;
    const trimmedText = text.slice(0, indexToTrimAt);
    if (trimmedText[trimmedText.length - 1] === " ") {
      return `${trimmedText} … -${reference}${linkWithSpace}`;
    }
    const lastSpaceIndex = trimmedText.lastIndexOf(" ");
    if (lastSpaceIndex === -1) {
      return `${trimmedText} … -${reference}${linkWithSpace}`;
    }
    return `${text.slice(0, lastSpaceIndex)} … -${reference}${linkWithSpace}`;
  }

  return `${baseTweet}${linkWithSpace}`;
}

export function occurrencesOfCharacterInString(
  character: string,
  string: string
): number {
  const regexp = new RegExp(character, "g");
  return string.length - string.replace(regexp, "").length;
}
