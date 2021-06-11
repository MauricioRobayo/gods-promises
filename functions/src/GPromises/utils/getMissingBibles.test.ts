import {getMissingKeysInObject} from "./getMissingBibles";

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
