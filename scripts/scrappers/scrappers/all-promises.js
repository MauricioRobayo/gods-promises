const fs = require("fs").promises;
const axios = require("axios");
const cheerio = require("cheerio");
const { makePromise } = require("../helpers");

const booksMap = {
  "I CORINTHIANS": "1 CORINTHIANS",
  "II CORINTHIANS": "2 CORINTHIANS",
  "I THESSALONIANS": "1 THESSALONIANS",
  "II THESSALONIANS": "2 THESSALONIANS",
  "I TIMOTHY": "1 TIMOTHY",
  "II TIMOTHY": "2 TIMOTHY",
  "I Peter": "1 Peter",
  "II Peter": "2 Peter",
  "I John": "1 John",
  "God is love": "God is love",
  "II John": "2 John",
  "III John": "3 John",
};

const url =
  "https://www.clintbyars.com/blog/2017/12/12/browse-a-list-of-gods-promises-from-each-book-of-the-bible";
axios.get(url).then(({ data }) => {
  let book = "";
  const promises = [];
  const $ = cheerio.load(data);
  $(".html-block > .sqs-block-content")
    .children()
    .each((_, el) => {
      const $el = $(el);
      if (el.tagName === "h1") {
        book = $el.text().trim();
        return;
      }

      if (book.toLowerCase() === "my favorite promises") {
        const reference = $el.find("strong").text();
        const promise = makePromise({ reference, source: url, booksMap });
        if (promise) {
          promises.push(promise);
        }
        return;
      }

      const match = $el.text().match(/^([0-9:,;-]+)/);
      if (book && match) {
        const verses = match[1];
        const reference = `${book} ${verses}`;
        const promise = makePromise({ reference, source: url, booksMap });
        if (promise) {
          promises.push(promise);
        }
      }
    });

  const filename = `${__dirname}/scrapped-data/all-promises.json`;

  fs.writeFile(filename, JSON.stringify(promises))
    .then(() => console.log(`wrote ${promises.length} promises to ${filename}`))
    .catch((err) => console.log(err));
});
