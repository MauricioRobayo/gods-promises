import axios from "axios";
import cheerio from "cheerio";
import { BaseGPromise, makeGPromise, writeData } from "../helpers";

const url =
  "https://www.clintbyars.com/blog/2017/12/12/browse-a-list-of-gods-promises-from-each-book-of-the-bible";
axios.get(url).then(({ data }) => {
  let book = "";
  const promises: BaseGPromise[] = [];
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
        const promise = makeGPromise({ reference, source: url });
        if (promise) {
          promises.push(promise);
        }
        return;
      }

      const match = $el.text().match(/^([0-9:,;-]+)/);
      if (book && match) {
        const verses = match[1];
        const reference = `${book} ${verses}`;
        const promise = makeGPromise({ reference, source: url });
        if (promise) {
          promises.push(promise);
        }
      }
    });

  writeData(promises, "all-promises.json");
});
