const fs = require("fs").promises;
const axios = require("axios");
const { getReferences, writeData } = require("../helpers");

const url = "https://outuponthewaters.com/160-promises-of-god-from-scripture/";
axios.get(url).then(({ data }) => {
  const references = getReferences(data, url);
  writeData(references, "160-promises.json");
});
