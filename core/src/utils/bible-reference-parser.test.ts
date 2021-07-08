import { getReferences } from "./bible-reference-parser";

describe("getReferences", () => {
  const singleReferences = [
    ["Genesis 1:1", ["Genesis 1:1"]],
    ["Genesis 1:1-3", ["Genesis 1:1–3"]],
    ["Genesis 1:1,2,3", ["Genesis 1:1–3"]],
    ["Genesis 1:1-3,5", ["Genesis 1:1–3", "Genesis 1:5"]],
    ["Genesis 1", []],
  ] as const;
  it.each(singleReferences)(
    "should parse %p into %p",
    (reference, expected) => {
      expect(getReferences(reference)).toEqual(expected);
    }
  );

  it("should exclude duplicates", () => {
    const text = `
      abc abc Gen 17:4
      (Gen 17:4)
      abc abc Gen 17:4,Genesis 17:4 abc abc
    `;
    const expected = ["Genesis 17:4"];

    expect(getReferences(text)).toEqual(expected);
  });

  it("should parse simple references", () => {
    const text = `
      abc abc Gen 17:4
      abc (Gen 17: 6)
      abc (Gen 17:6 abc)
      (Gen 17:7) abc
      abc abc Gen 17:4
    `;
    const expected = ["Genesis 17:4", "Genesis 17:6", "Genesis 17:7"];

    expect(getReferences(text)).toEqual(expected);
  });

  it("should parse complex references", () => {
    const text = `
      abc abc Gen 17:4-6
      abc (Gen 17: 6 – 8)
      abc (Gen 15:6,16:1-1,17:2-4 abc)
      Gen 17:7,Lamentations 1:1 abc 1 Peter 3:2
    `;
    const expected = [
      "Genesis 17:4–6",
      "Genesis 17:6–8",
      "Genesis 15:6",
      "Genesis 16:1",
      "Genesis 17:2–4",
      "Genesis 17:7",
      "Lamentations 1:1",
      "1 Peter 3:2",
    ];

    expect(getReferences(text)).toEqual(expected);
  });

  it("should not include chapters without verses", () => {
    const text = `
      abc abc Gen 17:4-6
      abc (Gen 17)
      abc (Gen 15:6,16:1-1,17:2-4 abc)
      Gen 17:7,Lamentations 1 abc 1 Peter 3:2
    `;
    const expected = [
      "Genesis 17:4–6",
      "Genesis 15:6",
      "Genesis 16:1",
      "Genesis 17:2–4",
      "Genesis 17:7",
      "1 Peter 3:2",
    ];

    expect(getReferences(text)).toEqual(expected);
  });
});
