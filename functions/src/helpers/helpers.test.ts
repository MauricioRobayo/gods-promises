import {nivLongToSpanish} from "./helpers";

describe("nivLongToSpanish", () => {
  const passages = [
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
  const error = ["", "non existing", "Peter"];
  it.each(passages)("should translate %p to %p", (en, es) => {
    expect(nivLongToSpanish(en)).toBe(es);
  });
  it.each(error)("should throw an error for %p", (error) => {
    expect(() => nivLongToSpanish(error)).toThrow();
  });
});
