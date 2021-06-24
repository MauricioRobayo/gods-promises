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
  months.map((month) => axios.get(`${url}/${month}-devotionals.html`))
).then((responses) => {
  let totalPromises = 0;
  for (let i = 0; i < months.length; i++) {
    const month = months[i];
    console.log({ month });
    const refs = bcv.parse(responses[i].data).osis().split(",");
    totalPromises += refs.length;
    const promises = refs.map((ref) =>
      makePromise({
        reference: ref,
        source: `${url}/${month}-devotionals.html`,
      })
    );
    console.log({ month, promises: promises.length });
    writeData(promises, `365-${month}-promises.json`);
  }
  console.log({ totalPromises });
});
