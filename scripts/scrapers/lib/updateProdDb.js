"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const helpers_1 = require("./helpers");
const repositories_1 = require("@mauriciorobayo/gods-promises/lib/repositories");
const helpers_2 = require("./helpers");
dotenv_1.default.config();
(async () => {
    const mongodbUri = process.env.MONGODB_URI;
    if (!mongodbUri) {
        console.error("MONGODB_URI is missing!");
        process.exit(1);
    }
    const gPromisesRepository = new repositories_1.GPromisesRepository(mongodbUri);
    const args = await Promise.resolve(yargs_1.default
        .option("careful", { string: true, choices: ["yes"] })
        .demandOption("careful").argv);
    const { _: files } = args;
    if (files.length === 0) {
        console.error("ERROR! No files provided.");
        process.exit(1);
    }
    const gPromises = await helpers_1.gPromisesFromFiles(files);
    await helpers_2.insertGPromises(gPromises, gPromisesRepository);
})();
