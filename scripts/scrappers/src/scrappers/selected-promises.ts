import axios from "axios";
import cheerio from "cheerio";
import { writeData } from "../helpers";
import {
  getOsisReference,
  gPromiseFromOsisReference,
} from "@mauriciorobayo/gods-promises/lib/utils";
import { IGPromise } from "@mauriciorobayo/gods-promises/lib/models";

const url = "https://bible.org/article/selected-promises-god-each-book-bible";
axios.get(url).then(({ data }) => {
  let book = "";
  const gPromises: IGPromise[] = [];
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
            const osis = getOsisReference(`${book} ${verses}`);
            const promise = gPromiseFromOsisReference({ osis, source: url });
            if (promise) {
              gPromises.push(promise);
            }
          }
        });
      }
    });

  writeData(gPromises, "selected-promises.json");
});
