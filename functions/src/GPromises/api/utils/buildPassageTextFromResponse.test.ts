import {buildPassageTextFromResponse} from "./buildPassageTextFromResponse";
import {ApiResponse} from "../bibleSuperSearch";

const response: ApiResponse = {
  results: [
    {
      verses: {
        kjv: {
          "12": {
            "4": {
              text: "¶ So Abram departed, as the LORD had spoken unto him; and Lot went with him: and Abram was seventy and five years old when he departed out of Haran.",
            },
          },
        },
      },
    },
    {
      verses: {
        kjv: {
          "18": {
            "18": {
              text: "Seeing that Abraham shall surely become a great and mighty nation, and all the nations of the earth shall be blessed in him?",
            },
          },
        },
      },
    },
  ],
};

describe("buildPassageTextFromResponse", () => {});
