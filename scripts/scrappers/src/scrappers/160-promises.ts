import axios from "axios";
import { writeData } from "../helpers";
import {
  getOsisReferences,
  gPromisesFromOsisReferences,
} from "@mauriciorobayo/gods-promises/lib/utils";

const url = "https://outuponthewaters.com/160-promises-of-god-from-scripture/";
axios.get(url).then(({ data }) => {
  const references = getOsisReferences(data);
  const gPromises = gPromisesFromOsisReferences(references, url);
  writeData(gPromises, "160-promises.json");
});
