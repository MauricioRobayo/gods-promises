"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeData = exports.gPromisesFromFiles = exports.insertGPromises = void 0;
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const promises_1 = tslib_1.__importDefault(require("fs/promises"));
const uniqBy_1 = tslib_1.__importDefault(require("lodash/uniqBy"));
const repositories_1 = require("@mauriciorobayo/gods-promises/lib/repositories");
dotenv_1.default.config();
async function insertGPromises(gPromises, gPromisesRepository) {
    try {
        const result = await gPromisesRepository.insertMany(gPromises, {
            ordered: false,
        });
        console.log({ insertedCount: result.insertedCount });
        process.exit();
    }
    catch (err) {
        if (err.code === 11000) {
            const { result } = err.result;
            console.log({
                ok: result.ok,
                writeErrors: result.writeErrors.length,
                insertedIds: result.insertedIds.length,
            });
            process.exit();
        }
        console.error(err);
        process.exit(1);
    }
}
exports.insertGPromises = insertGPromises;
function idGenerator() {
    const usedIds = new Set();
    return function () {
        let id = repositories_1.GPromisesRepository.pubIdGenerator();
        while (usedIds.has(id)) {
            console.log(`Id '${id} already used! Getting a new one...`);
            id = repositories_1.GPromisesRepository.pubIdGenerator();
        }
        usedIds.add(id);
        return id;
    };
}
async function gPromisesFromFiles(files) {
    const getId = idGenerator();
    const data = await Promise.all(files.map(async (file) => {
        const data = await promises_1.default.readFile(String(file), "utf-8");
        return JSON.parse(data);
    }));
    return uniqBy_1.default(data.flat(), "niv").map((gPromise) => ({
        ...gPromise,
        pubId: getId(),
    }));
}
exports.gPromisesFromFiles = gPromisesFromFiles;
async function writeData(gPromises, filename) {
    const dataDir = `${__dirname}/scraped-data`;
    const filePath = `${dataDir}/${filename}`;
    try {
        await promises_1.default.mkdir(dataDir, { recursive: true });
        await promises_1.default.writeFile(filePath, JSON.stringify(gPromises));
        console.log(`wrote ${gPromises.length} promises to ${filePath}`);
    }
    catch (err) {
        console.log(`writeData: ${JSON.stringify(err)}`);
    }
}
exports.writeData = writeData;
