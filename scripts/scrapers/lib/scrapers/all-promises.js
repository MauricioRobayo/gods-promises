"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const cheerio_1 = tslib_1.__importDefault(require("cheerio"));
const helpers_1 = require("../helpers");
const utils_1 = require("@mauriciorobayo/gods-promises/lib/utils");
const url = "https://www.clintbyars.com/blog/2017/12/12/browse-a-list-of-gods-promises-from-each-book-of-the-bible";
axios_1.default.get(url).then(({ data }) => {
    let book = "";
    const uniqueReferences = new Set();
    const $ = cheerio_1.default.load(data);
    $(".html-block > .sqs-block-content")
        .children()
        .each((_, el) => {
        const $el = $(el);
        if (el.tagName === "h1") {
            book = $el.text().trim();
            return;
        }
        if (book.toLowerCase() === "my favorite promises") {
            const references = utils_1.getReferences($el.find("strong").text());
            for (const reference of references) {
                uniqueReferences.add(reference);
            }
            return;
        }
        const match = $el.text().match(/^([0-9:,;-]+)/);
        if (book && match) {
            const verses = match[1];
            const references = utils_1.getReferences(`${book} ${verses}`);
            for (const reference of references) {
                uniqueReferences.add(reference);
            }
        }
    });
    const gPromises = utils_1.makeGPromises([...uniqueReferences], { url });
    helpers_1.writeData(gPromises, "all-promises.json");
});
