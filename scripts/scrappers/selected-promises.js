const fs = require("fs").promises;
const axios = require("axios");
const cheerio = require("cheerio");
const { getBookId, getStandardBookName } = require("./helpers");

const booksMap = {
  "FIRST SAMUEL": "1 SAMUEL",
  "SECOND SAMUEL": "2 SAMUEL",
  "FIRST KINGS": "1 KINGS",
  "SECOND KINGS": "2 KINGS",
  "FIRST CHRONICLES": "1 CHRONICLES",
  "SECOND CHRONICLES": "2 CHRONICLES",
  "SONG OF SONGS": "SONG OF SOLOMON",
  "FIRST CORINTHIANS": "1 CORINTHIANS",
  "SECOND CORINTHIANS": "2 CORINTHIANS",
  "FIRST THESSALONIANS": "1 THESSALONIANS",
  "SECOND THESSALONIANS": "2 THESSALONIANS",
  "FIRST TIMOTHY": "1 TIMOTHY",
  "SECOND TIMOTHY": "2 TIMOTHY",
  "FIRST PETER": "1 PETER",
  "SECOND PETER": "2 PETER",
  "FIRST JOHN": "1 JOHN",
  "SECOND JOHN": "2 JOHN",
  "THIRD JOHN": "3 JOHN",
};

const url = "https://bible.org/article/selected-promises-god-each-book-bible";
axios.get(url).then(({ data }) => {
  let bookId = "";
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
        const book = $el
          .text()
          .trim()
          .toUpperCase()
          .replace(" AND THE PROMISES OF GOD", "");
        bookId = getBookId(getStandardBookName(book, booksMap));
        return;
      }

      if (bookId && el.tagName === "ul") {
        $el.children().each((_, li) => {
          const match = $(li)
            .text()
            .match(/\((\d+:.*)\)\.?$/);
          if (match) {
            const ref = match[1].trim().replace(/ /g, "");
            const refs = ref.split(";");
            const references = [];
            refs.forEach((newRef) => {
              if (newRef.includes(",")) {
                const [chapter, multipleRefs] = newRef.split(":");
                multipleRefs.split(",").forEach((consecutiveRef) => {
                  references.push(`${bookId} ${chapter}:${consecutiveRef}`);
                });
              } else {
                references.push(`${bookId} ${newRef}`);
              }
            });
            promises.push({
              book: bookId,
              references,
              reference: `${bookId} ${ref}`,
              source: url,
            });
          }
        });
      }
    });

  const filename = `${__dirname}/scrapped-data/selected-promises.json`;

  fs.writeFile(filename, JSON.stringify(promises))
    .then(() => console.log(`wrote ${promises.length} promises to ${filename}`))
    .catch((err) => console.log(err));
});
