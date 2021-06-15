import { createTweet } from "./createTweet";

describe("createTweet", () => {
  const tweetLinkLength = 23;
  const tweetMaxLength = 275;

  describe("with link", () => {
    it("should trim the given text", () => {
      const text = "x".repeat(285);
      const reference = "y".repeat(10);
      const link = "z".repeat(tweetLinkLength);
      const tweet = createTweet({ text, reference, link });

      expect(tweet.length).toBe(280);
      expect(tweet).toMatch(/x+… -y{10} z{23}/);
    });

    it("should not trim the given text", () => {
      const text = "x".repeat(100);
      const reference = "y".repeat(10);
      const link = "z".repeat(tweetLinkLength);
      const tweet = createTweet({ text, reference, link });

      expect(tweet.length).toBeLessThan(tweetMaxLength);
      expect(tweet).toBe(`${text} -${reference} ${link}`);
    });
  });
  describe("without a link", () => {
    it("should trim the given text", () => {
      const text = "x".repeat(285);
      const reference = "y".repeat(10);
      const tweet = createTweet({ text, reference });

      expect(tweet.length).toBe(280);
      expect(tweet).toMatch(/x+… -y{10}/);
    });

    it("should not trim the given text", () => {
      const text = "x".repeat(100);
      const reference = "y".repeat(10);
      const tweet = createTweet({ text, reference });

      expect(tweet.length).toBeLessThan(tweetMaxLength);
      expect(tweet).toBe(`${text} -${reference}`);
    });
  });
});
