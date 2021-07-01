import axios from "axios";
const url = "https://www.365promises.com";
import { writeData } from "../helpers";
import {
  getOsisReferences,
  gPromisesFromOsisReferences,
} from "@mauriciorobayo/gods-promises/lib/utils";

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
    const references = getOsisReferences(data);
    const gPromises = gPromisesFromOsisReferences(references, source);
    return gPromises;
  })
).then((gPromises) => {
  writeData(gPromises.flat(), `365-promises.json`);
});
