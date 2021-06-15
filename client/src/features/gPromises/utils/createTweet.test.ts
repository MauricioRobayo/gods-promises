import {
  createTweet,
  occurrencesOfCharacterInString,
  TWEET_MAX_LENGTH,
} from "./createTweet";

describe("occurrencesOfCharacterInString", () => {
  const cases = [
    ["z", "aaaaaa aaaa a", 0],
    ["z", "zoo zebra jazz", 4],
    ["…", "…test of a string… more text…", 3],
    ["z", "z z z z", 4],
  ] as const;
  it.each(cases)(
    "should return the correct number of occurrences of %p in %p",
    (character, string, occurrences) => {
      expect(occurrencesOfCharacterInString(character, string)).toBe(
        occurrences
      );
    }
  );
});

describe("createTweet", () => {
  const tweetLinkLength = 23;
  const reference = "y".repeat(10);

  describe("with link", () => {
    const link = "z".repeat(tweetLinkLength);

    it("should trim the given text", () => {
      const text = "x".repeat(285);
      const tweet = createTweet({ text, reference, link });
      const occurrencesOfEllipses = occurrencesOfCharacterInString("…", tweet);

      expect(tweet.length).toBe(TWEET_MAX_LENGTH - occurrencesOfEllipses);
      expect(tweet).toMatch(/x+ … -y{10} z{23}/);
    });

    it("should trim the given text without splitting a word", () => {
      const text = `Hello, world! ${"x".repeat(285)}`;
      const tweet = createTweet({ text, reference, link });
      const expectedTweet = `Hello, world! … -${reference} ${link}`;

      expect(tweet.length).toBe(expectedTweet.length);
      expect(tweet).toBe(expectedTweet);
    });

    it("should not trim the given text", () => {
      const text = "x".repeat(100);
      const tweet = createTweet({ text, reference, link });

      expect(tweet.length).toBeLessThan(TWEET_MAX_LENGTH);
      expect(tweet).toBe(`${text} -${reference} ${link}`);
    });
  });

  describe("without a link", () => {
    it("should trim the given text", () => {
      const text = "x".repeat(285);
      const tweet = createTweet({ text, reference });
      const occurrencesOfEllipses = occurrencesOfCharacterInString("…", tweet);

      expect(tweet.length).toBe(TWEET_MAX_LENGTH - occurrencesOfEllipses);
      expect(tweet).toMatch(/x+ … -y{10}/);
    });

    it("should trim the given text without splitting a word", () => {
      const text = `Hello, world! ${"x".repeat(285)}`;
      const tweet = createTweet({ text, reference });
      const expectedTweet = `Hello, world! … -${reference}`;

      expect(tweet.length).toBe(expectedTweet.length);
      expect(tweet).toBe(expectedTweet);
    });

    it("should not trim the given text", () => {
      const text = "x".repeat(100);
      const tweet = createTweet({ text, reference });

      expect(tweet.length).toBeLessThan(TWEET_MAX_LENGTH);
      expect(tweet).toBe(`${text} -${reference}`);
    });
  });
});
