import { formatPassage } from "./formatPassage"

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

// @ponicode
describe("formatPassage.formatPassage", () => {
    test("0", () => {
        let callFunction: any = () => {
            formatPassage.formatPassage("   123¶user-name")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            formatPassage.formatPassage("¶ ")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            formatPassage.formatPassage("¶")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            formatPassage.formatPassage(" 123¶user-name")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            formatPassage.formatPassage("    123¶user-name")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            formatPassage.formatPassage("")
        }
    
        expect(callFunction).not.toThrow()
    })
})
