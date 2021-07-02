import {
  getReferences,
  makeGPromises,
} from "@mauriciorobayo/gods-promises/lib/utils";
import axios from "axios";
import { writeData } from "../helpers";

const urls = [
  "https://arabahjoy.com/gods-promises-in-scripture/",
  "https://davidjeremiah.blog/40-bible-verses-for-navigating-gods-promises-and-blessings/",
  "https://garmentsofsplendor.com/promises-of-god/",
  "https://lisaappelo.com/40-promises-of-god-when-you-need-hope/",
  "https://outuponthewaters.com/160-promises-of-god-from-scripture/",
  "https://www.biblestudytools.com/topical-verses/gods-promises-verses-in-the-bible/",
  "https://www.christianity.com/wiki/bible/what-are-god-s-promises-in-the-bible.html",
  "https://www.compassionuk.org/blogs/gods-promises/",
];

Promise.all(
  urls.map(async (url) => {
    const { data } = await axios.get(url);
    const osisReferences = getReferences(data);
    return makeGPromises(osisReferences, { url });
  })
).then((gPromises) => {
  writeData(gPromises.flat(), "4-sites.json");
});
