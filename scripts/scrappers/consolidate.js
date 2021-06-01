const p1 = require("./scrapped-data/300-promises.json");
const p2 = require("./scrapped-data/all-promises.json");
const p3 = require("./scrapped-data/selected-promises.json");
const p4 = require("./scrapped-data/160-promises.json");
const { writeToFirebase } = require("./helpers");

const promises = [...p1, ...p2, ...p3];

const allPromises = promises.map(({ bookId, ref }) => `${bookId} ${ref}`);

const uniquePromises = new Set(allPromises);

writeToFirebase([...uniquePromises]);
