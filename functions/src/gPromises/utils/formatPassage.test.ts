import {formatPassage} from "./formatPassage";

describe("formatPassage", () => {
  const cases = [
    ["   abc   ", "…abc…"],
    ["   Abc   ", "Abc…"],
    ["¶   Abc   ", "Abc…"],
    ["  ¶   Abc   ", "Abc…"],
    ["¶   Abc def.", "Abc def."],
    ["¶ abc def;", "…abc def…"],
    ["abc def:", "…abc def…"],
    ["abc def,", "…abc def…"],
    ["abc def   ¶", "…abc def…"],
    ["abc def  ,", "…abc def…"],
  ];
  it.each(cases)("should format %p into %p", (text, expected) => {
    expect(formatPassage(text)).toBe(expected);
  });
});
