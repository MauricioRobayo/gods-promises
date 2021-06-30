import axios from "axios";
import { writeData } from "../helpers";
import { getReferences } from "@mauriciorobayo/gods-promises/lib/utils";

const url = "https://outuponthewaters.com/160-promises-of-god-from-scripture/";
axios.get(url).then(({ data }) => {
  const references = getReferences(data, url);
  writeData(references, "160-promises.json");
});
