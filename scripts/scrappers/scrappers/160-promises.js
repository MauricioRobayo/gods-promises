const fs = require("fs").promises;
const axios = require("axios");
const cheerio = require("cheerio");
const { makePromise } = require("../helpers");

const booksMap = {
  Psalm: "Psalms",
};

const url = "https://outuponthewaters.com/160-promises-of-god-from-scripture/";
axios.get(url).then(({ data }) => {
  const promises = [];
  const $ = cheerio.load(data);
  $(".fl-module-content.fl-node-content").each((_, el) => {
    const content = $(el);
    content.find("p").each((_, p) => {
      const promise = $(p).text();
      const match = promise.match(/ - (.*)$/);
      if (match) {
        const reference = match[1];
        const promise = makePromise({ reference, source: url, booksMap });
        if (promise) {
          promises.push(promise);
        }
      }
    });
  });

  const filename = `${__dirname}/scrapped-data/160-promises.json`;

  fs.writeFile(filename, JSON.stringify(promises))
    .then(() => console.log(`wrote ${promises.length} promises to ${filename}`))
    .catch((err) => console.log(err));
});
