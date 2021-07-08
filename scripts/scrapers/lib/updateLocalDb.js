"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const sampleSize_1 = tslib_1.__importDefault(require("lodash/sampleSize"));
const helpers_1 = require("./helpers");
const repositories_1 = require("@mauriciorobayo/gods-promises/lib/repositories");
const helpers_2 = require("./helpers");
const gPromisesRepository = new repositories_1.GPromisesRepository("mongodb://localhost:27017");
(async () => {
    const args = await Promise.resolve(yargs_1.default.option("sampleSize", { number: true, default: 5, alias: "s" }).argv);
    const { _: files, sampleSize: n } = args;
    console.log({ files, n });
    if (files.length === 0) {
        console.error("ERROR! No files provided.");
        process.exit(1);
    }
    const gPromises = await helpers_1.gPromisesFromFiles(files);
    const sample = n <= 0 ? gPromises : sampleSize_1.default(gPromises, n);
    await helpers_2.insertGPromises(sample, gPromisesRepository);
})();
