import {
  getOsisReferences,
  gPromisesFromOsisReferences,
} from "@mauriciorobayo/gods-promises/lib/utils";
import axios from "axios";
import { writeData } from "../helpers";

const urls = [
  "https://www.compassionuk.org/blogs/gods-promises/",
  "https://www.biblestudytools.com/topical-verses/gods-promises-verses-in-the-bible/",
  "https://lisaappelo.com/40-promises-of-god-when-you-need-hope/",
  "https://davidjeremiah.blog/40-bible-verses-for-navigating-gods-promises-and-blessings/",
];

Promise.all(
  urls.map(async (url) => {
    const { data } = await axios.get(url);
    const osisReferences = getOsisReferences(data);
    return gPromisesFromOsisReferences(osisReferences, url);
  })
).then((gPromises) => {
  writeData(gPromises.flat(), "4-sites.json");
});
