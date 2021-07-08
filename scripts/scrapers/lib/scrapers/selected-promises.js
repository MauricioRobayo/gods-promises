"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const cheerio_1 = tslib_1.__importDefault(require("cheerio"));
const helpers_1 = require("../helpers");
const utils_1 = require("@mauriciorobayo/gods-promises/lib/utils");
const url = "https://bible.org/article/selected-promises-god-each-book-bible";
axios_1.default.get(url).then(({ data }) => {
    let book = "";
    const uniqueReferences = new Set();
    const $ = cheerio_1.default.load(data);
    $("#block-system-main > div > div > article > div.field.field-name-body.field-type-text-with-summary.field-label-hidden > div > div")
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
                    const references = utils_1.getReferences(`${book} ${verses}`);
                    for (const reference of references) {
                        uniqueReferences.add(reference);
                    }
                }
            });
        }
    });
    const gPromises = utils_1.makeGPromises([...uniqueReferences], { url });
    helpers_1.writeData(gPromises, "selected-promises.json");
});
