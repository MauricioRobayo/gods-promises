const axios = require("axios");
const bcv_parser =
  require("bible-passage-reference-parser/js/en_bcv_parser").bcv_parser;
const url = "https://www.365promises.com";
const { makePromise, writeData } = require("../helpers");
const bcv = new bcv_parser();

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
    const response = await axios.get(source);
    return { month, source, data: response.data };
  })
).then((responses) => {
  for (const { month, source, data } of responses) {
    const promises = getReferences(data, source);
    writeData(promises, `365-${month}-promises.json`);
  }
});

function getReferences(data, source) {
  const refs = bcv.parse(data).osis().split(",");
  const promises = refs.map((reference) =>
    makePromise({
      reference,
      source,
    })
  );
  return promises;
}
