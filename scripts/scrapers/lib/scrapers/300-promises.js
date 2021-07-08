"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const cheerio_1 = tslib_1.__importDefault(require("cheerio"));
const helpers_1 = require("../helpers");
const utils_1 = require("@mauriciorobayo/gods-promises/lib/utils");
const url = "https://believersportal.com/list-of-3000-promises-in-the-bible/";
axios_1.default.get(url).then(({ data }) => {
    let book = "";
    const $ = cheerio_1.default.load(data);
    const uniqueReferences = new Set();
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
                    const references = utils_1.getReferences(`${book} ${verses}`);
                    for (const reference of references) {
                        uniqueReferences.add(reference);
                    }
                }
            });
        }
    });
    const gPromises = utils_1.makeGPromises([...uniqueReferences], { url });
    helpers_1.writeData(gPromises, "300-promises.json");
});
