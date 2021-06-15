export function createTweet({
  text,
  reference,
  link = "",
}: {
  text: string;
  reference: string;
  link?: string;
}): string {
  const tweetMaxLength = 275;
  const twitterLinkWithSpaceLength = 24; // all links are 23 chars on twitter + 1 for a space
  const linkWithSpace = link ? ` ${link}` : "";
  const baseTweet = `${text} -${reference}`;
  const tweetLength =
    baseTweet.length + (link ? twitterLinkWithSpaceLength : 0);
  if (tweetLength > tweetMaxLength) {
    const extraLength = tweetLength - tweetMaxLength;
    const ellipsisLength = "…".length;
    const trimmedText = text.slice(
      0,
      text.length - extraLength - ellipsisLength
    );
    return `${trimmedText}… -${reference}${linkWithSpace}`;
  }

  return `${baseTweet}${linkWithSpace}`;
}
