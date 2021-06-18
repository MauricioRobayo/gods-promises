import axios from "axios";
import {bibles} from "@mauriciorobayo/gods-promises/lib/config";
import BibleSuperSearch, {ApiResponse} from "./bibleSuperSearch";
import {BibleId, Lang} from "@mauriciorobayo/gods-promises/lib/types";
import {Content} from "@mauriciorobayo/gods-promises/lib/models";

const mockVerses = ["verse 1", "verse 2", "verse 3", "verse 4"];
const mockTranslator = jest.fn(
  (_lang: Lang, reference: string): string => reference
);
const mockFormatter = jest.fn((text: string): string => text);

afterEach(() => {
  mockTranslator.mockClear();
  mockFormatter.mockClear();
});

describe("bibleSuperSearch", () => {
  it("should return the correct response for one bible", async () => {
    const requestedBibles: BibleId[] = ["kjv"];
    const requestedReference = "Book 1:1-2,3; 2:1";
    const mockResponse: ApiResponse = {
      results: [
        {
          verses: {
            kjv: {
              "1": {
                "1": {text: mockVerses[0]},
                "2": {text: mockVerses[1]},
              },
            },
          },
        },
        {
          verses: {
            kjv: {
              "1": {
                "3": {text: mockVerses[2]},
              },
            },
          },
        },
        {
          verses: {
            kjv: {
              "2": {
                "1": {text: mockVerses[3]},
              },
            },
          },
        },
      ],
    };
    const mockedGet = jest.spyOn(axios, "get").mockImplementation(() => {
      return Promise.resolve({
        data: mockResponse,
      });
    });
    const bibleSuperSearch = new BibleSuperSearch({
      bibles,
      translator: mockTranslator,
      formatter: mockFormatter,
    });
    const content = await bibleSuperSearch.getPassageFromReference(
      requestedBibles,
      requestedReference
    );
    const expectedApiUrl = `https://api.biblesupersearch.com/api?bible=${JSON.stringify(
      requestedBibles
    )}&reference=${requestedReference}`;
    const expected: Content = {
      kjv: {
        text: "verse 1 verse 2 …verse 3 …verse 4",
        reference: requestedReference,
        apiUrl: expectedApiUrl,
      },
    };

    expect(content).toEqual(expected);
    expect(mockedGet).toBeCalledWith(expectedApiUrl);
    expect(mockFormatter).toBeCalledTimes(1);
    expect(mockTranslator).toBeCalledTimes(1);
    requestedBibles.forEach((bible) => {
      expect(mockFormatter).toBeCalledWith(expected[bible]?.text);
      expect(mockTranslator).toBeCalledWith(
        bibles[bible].lang,
        requestedReference
      );
    });
  });
  it("should return the correct response for two bibles", async () => {
    const requestedBibles: BibleId[] = ["kjv", "rvg"];
    const requestedReference = "Book 1:1-2,3; 2:1";
    const mockResponse: ApiResponse = {
      results: [
        {
          verses: {
            kjv: {
              "1": {
                "1": {text: mockVerses[0]},
                "2": {text: mockVerses[1]},
              },
            },
            rvg: {
              "1": {
                "1": {text: mockVerses[0]},
                "2": {text: mockVerses[1]},
              },
            },
          },
        },
        {
          verses: {
            kjv: {
              "1": {
                "3": {text: mockVerses[2]},
              },
            },
            rvg: {
              "1": {
                "3": {text: mockVerses[2]},
              },
            },
          },
        },
        {
          verses: {
            kjv: {
              "2": {
                "1": {text: mockVerses[3]},
              },
            },
            rvg: {
              "2": {
                "1": {text: mockVerses[3]},
              },
            },
          },
        },
      ],
    };
    const mockedGet = jest.spyOn(axios, "get").mockImplementation(() => {
      return Promise.resolve({
        data: mockResponse,
      });
    });
    const bibleSuperSearch = new BibleSuperSearch({
      bibles,
      translator: mockTranslator,
      formatter: mockFormatter,
    });
    const content = await bibleSuperSearch.getPassageFromReference(
      requestedBibles,
      requestedReference
    );
    const expectedApiUrl = `https://api.biblesupersearch.com/api?bible=${JSON.stringify(
      requestedBibles
    )}&reference=${requestedReference}`;
    const expected: Content = {
      kjv: {
        text: "verse 1 verse 2 …verse 3 …verse 4",
        reference: requestedReference,
        apiUrl: expectedApiUrl,
      },
      rvg: {
        text: "verse 1 verse 2 …verse 3 …verse 4",
        reference: requestedReference,
        apiUrl: expectedApiUrl,
      },
    };

    expect(content).toEqual(expected);
    expect(mockedGet).toBeCalledWith(expectedApiUrl);
    expect(mockTranslator).toBeCalledTimes(2);
    expect(mockFormatter).toBeCalledTimes(2);
    requestedBibles.forEach((bible) => {
      expect(mockFormatter).toBeCalledWith(expected[bible]?.text);
      expect(mockTranslator).toBeCalledWith(
        bibles[bible].lang,
        requestedReference
      );
    });
  });
});
