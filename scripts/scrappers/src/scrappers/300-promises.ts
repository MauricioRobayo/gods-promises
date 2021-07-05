import axios from "axios";
import cheerio from "cheerio";
import { writeData } from "../helpers";
import {
  getReferences,
  makeGPromises,
} from "@mauriciorobayo/gods-promises/lib/utils";

const url = "https://believersportal.com/list-of-3000-promises-in-the-bible/";

axios.get(url).then(({ data }) => {
  let book = "";
  const $ = cheerio.load(data);
  const uniqueReferences = new Set<string>();
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
            const references = getReferences(`${book} ${verses}`);
            for (const reference of references) {
              uniqueReferences.add(reference);
            }
          }
        });
      }
    });

  const gPromises = makeGPromises([...uniqueReferences], { url });
  writeData(gPromises, "300-promises.json");
});
