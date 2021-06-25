import axios from "axios";
import { getReferences, writeData } from "../helpers";

const url = "https://outuponthewaters.com/160-promises-of-god-from-scripture/";
axios.get(url).then(({ data }) => {
  const references = getReferences(data, url);
  writeData(references, "160-promises.json");
});
