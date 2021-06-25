const fs = require("fs").promises;
const axios = require("axios");
const cheerio = require("cheerio");
const { makeGPromise, writeData } = require("../helpers");

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
            const promise = makeGPromise({ reference, source: url });
            if (promise) {
              promises.push(promise);
            }
          }
        });
      }
    });

  writeData(promises, "selected-promises.json");
});
