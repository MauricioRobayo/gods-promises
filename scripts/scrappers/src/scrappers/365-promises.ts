import axios from "axios";
const url = "https://www.365promises.com";
import { writeData } from "../helpers";
import { getReferences } from "@mauriciorobayo/gods-promises/lib/utils";

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

Promise.all(
  months.map(async (month) => {
    const source = `${url}/${month}-devotionals.html`;
    const { data } = await axios.get(source);
    const references = getReferences(data, source);
    return references;
  })
).then((references) => {
  writeData(references.flat(), `365-promises.json`);
});
