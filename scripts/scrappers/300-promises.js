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
};

axios.get(url).then(({ data }) => {
  let book = "";
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

      book = book === "OLD TESTAMENT" ? "GENESIS" : book;
      if (book && el.tagName === "ul") {
        $el.children().each((_, li) => {
          const match = $(li)
            .text()
            .match(/\((\d+:.*)\)\.?$/);
          const bookId = getBookId(getStandardBookName(book, booksMap));
          if (bookId && match) {
            const ref = match[1].trim().replace(/ /g, "");
            const refs = ref.split(";");
            refs.forEach((newRef) => {
              if (newRef.includes(",")) {
                const [chapter, multipleRefs] = newRef.split(":");
                multipleRefs.split(",").forEach((consecutiveRef) => {
                  const promise = {
                    bookId,
                    ref: `${chapter}:${consecutiveRef}`,
                  };
                  promises.push(promise);
                });
                return;
              }
              const promise = {
                bookId,
                ref: newRef,
              };
              promises.push(promise);
            });
          }
        });
      }
    });

  const filename = `${__dirname}/scrapped-data/300-promises.json`;

  fs.writeFile(filename, JSON.stringify(promises))
    .then(() => console.log(`wrote ${promises.length} promises to ${filename}`))
    .catch((err) => console.log(err));
});
