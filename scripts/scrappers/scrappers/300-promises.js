const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs").promises;
const { makePromise, writeData } = require("../helpers");

const url = "https://believersportal.com/list-of-3000-promises-in-the-bible/";

axios.get(url).then(({ data }) => {
  let book = "";
  let bookId = "";
  const promises = [];
  const $ = cheerio.load(data);
  $(".td-post-content")
    .children()
    .each((_, el) => {
      const $el = $(el);
      if (el.tagName === "h4") {
        book = $el
          .text()
          .trim()
          .toUpperCase()
          .replace(" AND THE PROMISES OF GOD", "");
        return;
      }

      if (el.tagName === "p") {
        const strong = $el.find("strong");
        if (strong) {
          book = strong.text();
        }
      }

      book = book === "OLD TESTAMENT" ? "GENESIS" : book;

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

  writeData(promises, "300-promises.json");
});
