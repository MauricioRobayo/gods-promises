import {
  nivLongToSpanish,
  cleanPassage,
  getMissingKeysInObject,
} from "./helpers";

describe("getMissingKeysInObject", () => {
  const cases = [
    {keys: ["a", "b"], object: {a: 1, b: 2}, expected: []},
    {keys: ["b"], object: {a: 1, b: 2}, expected: []},
    {keys: ["a", "b", "c"], object: {a: 1, b: 2}, expected: ["c"]},
    {keys: ["a", "b", "c"], object: {b: 2}, expected: ["a", "c"]},
    {keys: ["a", "b", "c"], object: {c: 3}, expected: ["a", "b"]},
    {keys: ["a", "b"], object: {}, expected: ["a", "b"]},
    {keys: ["a", "b"], object: undefined, expected: ["a", "b"]},
  ];
  it.each(cases)(
    ".getMissingKeysInObject($keys, $object) should return $expected",
    ({keys, object, expected}) => {
      expect(getMissingKeysInObject(keys, object)).toEqual(expected);
    }
  );
});

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

describe("nivLongToSpanish", () => {
  const successCases = [
    ["1 Timothy", "1 Timoteo"],
    ["1 Timothy 1:2-3", "1 Timoteo 1:2-3"],
    [
      "1 Timothy 1:2-3, 2 Timothy 1:2-3,4",
      "1 Timoteo 1:2-3, 2 Timoteo 1:2-3,4",
    ],
    ["1 Corinthians 1:2-3;4-5 abc def", "1 Corintios 1:2-3;4-5 abc def"],
    [
      "John 1 John 1, 2 John 3 3 John 1:2-3;4-5",
      "Juan 1 Juan 1, 2 Juan 3 3 Juan 1:2-3;4-5",
    ],
  ];
  const errorCases = ["", "non existing", "Peter"];
  it.each(successCases)("should convert %p to %p", (en, es) => {
    expect(nivLongToSpanish(en)).toBe(es);
  });
  it.each(errorCases)("should throw an error for %p", (errorCase) => {
    expect(() => nivLongToSpanish(errorCase)).toThrow();
  });
});
