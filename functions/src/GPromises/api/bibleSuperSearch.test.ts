import axios from "axios";
import {bibles} from "../../config";
import BibleSuperSearch, {ApiResponse} from "./bibleSuperSearch";
import {translator} from "../utils/translator";

const mockVerses = ["verse 1", "verse 2", "verse 3", "verse 4"];

describe("bibleSuperSearch", () => {
  it("should return the correct response for one bible", async () => {
    const requestedBibles = ["kjv"] as any;
    const requestedReference = "Book 1:1-2,3; 2:1";
    const mockResult1 = {
      verses: {
        kjv: {
          "1": {
            "1": {text: mockVerses[0]},
            "2": {text: mockVerses[1]},
          },
        },
      },
    };
    const mockResult2 = {
      verses: {
        kjv: {
          "1": {
            "3": {text: mockVerses[2]},
          },
        },
      },
    };
    const mockResult3 = {
      verses: {
        kjv: {
          "2": {
            "1": {text: mockVerses[3]},
          },
        },
      },
    };
    const mockResponse: ApiResponse = {
      results: [mockResult1, mockResult2, mockResult3],
    };
    const mockedGet = jest.spyOn(axios, "get").mockImplementation(() => {
      return Promise.resolve({
        data: mockResponse,
      });
    });
    const bibleSuperSearch = new BibleSuperSearch(bibles, translator);
    const content = await bibleSuperSearch.getPassageFromReference(
      requestedBibles,
      requestedReference
    );
    const expected = {
      kjv: {
        text: mockVerses.join("\n"),
        reference: requestedReference,
      },
    };

    expect(content).toEqual(expected);
    expect(mockedGet).toBeCalledWith(
      `https://api.biblesupersearch.com/api?bible=${JSON.stringify(
        requestedBibles
      )}&reference=${requestedReference}`
    );
  });
});
