const fs = require("fs").promises;
const { nanoid } = require("nanoid");
const { getMongoDbCollection, shuffle } = require("./helpers");

const [, , ...files] = process.argv;
if (files.length === 0) {
  console.error(`Please specify a file or files!`);
  process.exit(1);
}

const createUniqueIndex = async (collection, field) => {
  return await collection.createIndex({ [field]: 1 }, { unique: true });
};

const updateDb = async (promises) => {
  const promisesCollection = await getMongoDbCollection("g-promises");
  const index = await createUniqueIndex(promisesCollection, "osis");
  console.log(`Successfully created index ${index}!`);
  return promisesCollection.insertMany(promises, { ordered: false });
};

Promise.all(files.map((file) => fs.readFile(file)))
  .then((filesData) =>
    filesData
      .map((fileData) =>
        JSON.parse(fileData).map((data) => ({
          _id: nanoid(8),
          ...data,
        }))
      )
      .flat()
  )
  .then((promises) => updateDb(promises))
  // .then((promises) => updateDb(shuffle(promises).slice(0, 5)))
  .then((result) => {
    console.log({ insertedCount: result.insertedCount });
    process.exit();
  })
  .catch((err) => {
    if (err.code === 11000) {
      console.log(`Skipped ${err.writeErrors.length} duplicated promises`);
      process.exit();
    }
    console.error(err);
    process.exit(1);
  });
