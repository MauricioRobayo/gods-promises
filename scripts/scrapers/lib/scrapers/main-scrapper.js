"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("@mauriciorobayo/gods-promises/lib/utils");
const axios_1 = tslib_1.__importDefault(require("axios"));
const uniqBy_1 = tslib_1.__importDefault(require("lodash/uniqBy"));
const helpers_1 = require("../helpers");
const urls = [
    ...Array.from({ length: 147 }, (_, i) => i + 1).map((page) => `https://dailybiblepromise.com/page/${page}/`),
    ...[
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
    ].map((month) => `https://www.365promises.com/${month}-devotionals.html`),
    "https://arabahjoy.com/gods-promises-in-scripture/",
    "https://davidjeremiah.blog/40-bible-verses-for-navigating-gods-promises-and-blessings/",
    "https://garmentsofsplendor.com/promises-of-god/",
    "https://lisaappelo.com/40-promises-of-god-when-you-need-hope/",
    "https://outuponthewaters.com/160-promises-of-god-from-scripture/",
    "https://recursoscristianosweb.com/versiculos-de-la-biblia/promesas-biblicas/",
    "https://www.biblestudytools.com/topical-verses/gods-promises-verses-in-the-bible/",
    "https://www.christianity.com/wiki/bible/what-are-god-s-promises-in-the-bible.html",
    "https://www.compassionuk.org/blogs/gods-promises/",
    "https://www.bibleinfo.com/en/topics/bible-promises",
    "https://bibleverses70.com/biblical-promises/",
];
Promise.all(urls.map(async (url) => {
    try {
        const { data } = await axios_1.default.get(url);
        return utils_1.getReferences(data);
    }
    catch (e) {
        console.log(`Request to ${url} failed!`);
        return [];
    }
}))
    .then((references) => {
    const gPromises = references
        .map((refs, i) => utils_1.makeGPromises(refs, { url: urls[i] }))
        .flat();
    const uniqueGPromises = uniqBy_1.default(gPromises, "niv");
    return helpers_1.writeData(uniqueGPromises, "main-scraper.json");
})
    .then(() => process.exit());
