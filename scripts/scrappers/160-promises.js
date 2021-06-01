const fs = require("fs").promises;
const axios = require("axios");
const cheerio = require("cheerio");
const { getBookId, getStandardBookName } = require("./helpers");

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
      const match = promise.match(/ - (\d* ?\w+) (\d+:.*)$/);
      if (match) {
        const book = match[1];
        const ref = match[2];
        const bookId = getBookId(getStandardBookName(book, booksMap));
        if (ref.includes(";")) {
          const [chapter, refs] = ref.split(":");
          refs.split(";").forEach((newRef) => {
            promises.push({
              bookId,
              ref: `${chapter}:${newRef.trim().replace(/[^0-9:-]/g, "")}`,
            });
          });
          return;
        }
        promises.push({
          bookId,
          ref: ref.trim().replace(/[^0-9:-]/g, ""),
        });
      }
    });
  });

  const filename = `${__dirname}/scrapped-data/160-promises.json`;

  fs.writeFile(filename, JSON.stringify(promises))
    .then(() => console.log(`wrote ${promises.length} promises to ${filename}`))
    .catch((err) => console.log(err));
});
