const fs = require("fs").promises;
const axios = require("axios");
const cheerio = require("cheerio");
const { makePromise } = require("../helpers");

const url = "https://bible.org/article/selected-promises-god-each-book-bible";
axios.get(url).then(({ data }) => {
  let book = "";
  const promises = [];
  const $ = cheerio.load(data);
  $(
    "#block-system-main > div > div > article > div.field.field-name-body.field-type-text-with-summary.field-label-hidden > div > div"
  )
    .children()
    .each((_, el) => {
      const $el = $(el);
      if (el.tagName === "p") {
        return;
      }

      if (el.tagName === "h4") {
        book = $el
          .text()
          .trim()
          .toUpperCase()
          .replace(" AND THE PROMISES OF GOD", "");
        return;
      }

      if (book && el.tagName === "ul") {
        $el.children().each((_, li) => {
          const match = $(li)
            .text()
            .match(/\(([v0-9\-;:,. ]+)\)\.?$/);
          if (match) {
            const verses = match[1];
            const reference = `${book} ${verses}`;
            const promise = makePromise({ reference, source: url });
            if (promise) {
              promises.push(promise);
            }
          }
        });
      }
    });

  const filename = `${__dirname}/scrapped-data/selected-promises.json`;

  fs.writeFile(filename, JSON.stringify(promises))
    .then(() => console.log(`wrote ${promises.length} promises to ${filename}`))
    .catch((err) => console.log(err));
});
