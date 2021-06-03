const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs").promises;
const { getBookId, getStandardBookName } = require("./helpers");

const url = "https://believersportal.com/list-of-3000-promises-in-the-bible/";

const booksMap = {
  "FIRST SAMUEL": "1 SAMUEL",
  "SECOND SAMUEL": "2 SAMUEL",
  "FIRST KINGS": "1 KINGS",
  "SECOND KINGS": "2 KINGS",
  "FIRST CHRONICLES": "1 CHRONICLES",
  "SECOND CHRONICLES": "2 CHRONICLES",
  "SONG OF SONGS": "SONG OF SOLOMON",
  "I CORINTHIANS": "1 CORINTHIANS",
  "II CORINTHIANS": "2 CORINTHIANS",
  "I THESSALONIANS": "1 THESSALONIANS",
  "II THESSALONIANS": "2 THESSALONIANS",
  "I TIMOTHY": "1 TIMOTHY",
  "II TIMOTHY": "2 TIMOTHY",
  "I PETER": "1 PETER",
  "II PETER": "2 PETER",
  "I JOHN": "1 JOHN",
  "II JOHN": "2 JOHN",
  "III JOHN": "3 JOHN",
};

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
      bookId = getBookId(getStandardBookName(book, booksMap));

      if (bookId && el.tagName === "ul") {
        $el.children().each((_, li) => {
          const match = $(li)
            .text()
            .match(/\((\d+:.*)\)\.?$/);
          if (match) {
            const promise = [];
            const ref = match[1].trim().replace(/ /g, "");
            const refs = ref.split(";");
            refs.forEach((newRef) => {
              if (newRef.includes(",")) {
                const [chapter, multipleRefs] = newRef.split(":");
                multipleRefs.split(",").forEach((consecutiveRef) => {
                  promise.push(`${bookId} ${chapter}:${consecutiveRef}`);
                });
              } else {
                promise.push(`${bookId} ${newRef}`);
              }
            });
            promises.push({ reference: promise, source: url });
          }
        });
      }
    });

  const filename = `${__dirname}/scrapped-data/300-promises.json`;

  fs.writeFile(filename, JSON.stringify(promises))
    .then(() => console.log(`wrote ${promises.length} promises to ${filename}`))
    .catch((err) => console.log(err));
});
