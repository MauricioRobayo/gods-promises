import {cleanPassage} from "./cleanPassage";

describe("cleanPassage", () => {
  const baseText = "some passage";
  const keepChars = ["?", "!", ".", '"', "'"];
  const replaceChars = [";", ":", ","];
  const appendChars = ["", "9"];
  it.each(keepChars)("should keep %p at the end of a string", (keep) => {
    expect(cleanPassage(`${baseText}${keep}`)).toBe(`${baseText}${keep}`);
  });
  it.each(replaceChars)(
    'should replace %p at the end of a string with a "."',
    (replace) => {
      expect(cleanPassage(`${baseText}${replace}`)).toBe(`${baseText}.`);
    }
  );
  it.each(appendChars)("should add '.' if string ends with %p", (append) => {
    expect(cleanPassage(`${baseText}${append}`)).toBe(`${baseText}${append}.`);
  });
});
