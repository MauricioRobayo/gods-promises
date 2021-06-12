import { formatPassage } from "./formatPassage";

describe("cleanPassage", () => {
  const cases = [
    ["Some passage.", "Some passage."],
    ["Some passage?", "Some passage?"],
    ["Some passage!", "Some passage!"],
    ["some passage!", "…some passage!"],
    ["some passage.", "…some passage."],
    ["Some passage", "Some passage…"],
    ["some passage", "…some passage…"],
    ["some passage;", "…some passage…"],
    ["some passage:", "…some passage…"],
    ["some passage,", "…some passage…"],
    ["¶Some passage.", "Some passage."],
  ];
  it.each(cases)("should format %p as %p", (passage, expected) => {
    expect(formatPassage(passage)).toBe(expected);
  });
});
