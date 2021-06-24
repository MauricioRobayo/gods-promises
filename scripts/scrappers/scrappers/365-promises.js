const axios = require("axios");
const url = "https://www.365promises.com";
const { getReferences, writeData } = require("../helpers");

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
    return { source, data: response.data };
  })
).then((responses) => {
  const allPromises = responses
    .map(({ data, source }) => getReferences(data, source))
    .flat();
  writeData(allPromises, `365-promises.json`);
});
