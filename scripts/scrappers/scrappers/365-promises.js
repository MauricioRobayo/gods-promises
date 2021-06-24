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
    const response = await axios.get(`${url}/${month}-devotionals.html`);
    return [month, response.data];
  })
).then((responses) => {
  for (const [month, data] of responses) {
    const refs = bcv.parse(data).osis().split(",");
    const promises = refs.map((ref) =>
      makePromise({
        reference: ref,
        source: `${url}/${month}-devotionals.html`,
      })
    );
    writeData(promises, `365-${month}-promises.json`);
  }
});
