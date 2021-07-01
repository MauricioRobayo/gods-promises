import axios from "axios";
import cheerio from "cheerio";
import { writeData } from "../helpers";
import {
  getOsisReference,
  gPromiseFromOsisReference,
} from "@mauriciorobayo/gods-promises/lib/utils";
import { IGPromise } from "@mauriciorobayo/gods-promises/lib/models";

const url =
  "https://www.clintbyars.com/blog/2017/12/12/browse-a-list-of-gods-promises-from-each-book-of-the-bible";
axios.get(url).then(({ data }) => {
  let book = "";
  const promises: IGPromise[] = [];
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
        const osis = getOsisReference($el.find("strong").text());
        const gPromise = gPromiseFromOsisReference({ osis, source: url });
        if (gPromise) {
          promises.push(gPromise);
        }
        return;
      }

      const match = $el.text().match(/^([0-9:,;-]+)/);
      if (book && match) {
        const verses = match[1];
        const osis = getOsisReference(`${book} ${verses}`);
        const gPromise = gPromiseFromOsisReference({ osis, source: url });
        if (gPromise) {
          promises.push(gPromise);
        }
      }
    });

  writeData(promises, "all-promises.json");
});
