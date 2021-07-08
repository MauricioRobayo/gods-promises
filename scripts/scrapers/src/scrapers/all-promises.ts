import axios from "axios";
import cheerio from "cheerio";
import { writeData } from "../helpers";
import {
  getReferences,
  makeGPromises,
} from "@mauriciorobayo/gods-promises/lib/utils";

const url =
  "https://www.clintbyars.com/blog/2017/12/12/browse-a-list-of-gods-promises-from-each-book-of-the-bible";
axios.get(url).then(({ data }) => {
  let book = "";
  const uniqueReferences = new Set<string>();
  const $ = cheerio.load(data);
  $(".html-block > .sqs-block-content")
    .children()
    // @ts-ignore
    .each((_, el) => {
      const $el = $(el);
      if (el.tagName === "h1") {
        book = $el.text().trim();
        return;
      }

      if (book.toLowerCase() === "my favorite promises") {
        const references = getReferences($el.find("strong").text());
        for (const reference of references) {
          uniqueReferences.add(reference);
        }
        return;
      }

      const match = $el.text().match(/^([0-9:,;-]+)/);
      if (book && match) {
        const verses = match[1];
        const references = getReferences(`${book} ${verses}`);
        for (const reference of references) {
          uniqueReferences.add(reference);
        }
      }
    });

  const gPromises = makeGPromises([...uniqueReferences], { url });
  writeData(gPromises, "all-promises.json");
});
