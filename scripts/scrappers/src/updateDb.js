const fs = require("fs").promises;
const { nanoid } = require("nanoid");
const { getMongoDbCollection, shuffle } = require("./helpers");
const argv = require("yargs/yargs")(process.argv.slice(2)).argv;
const chalk = require("chalk");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const { _: files, careful, noSample, sample } = argv;

const localhost = "mongodb://localhost:27017";
const mongodbUri = process.env.MONGODB_URI || localhost;
const mongoDb = process.env.MONGODB_DB;
const collection = "g-promises";
const sampleSize = sample || 5;

if (!mongoDb) {
  console.error(
    chalk.bold(chalk.red("ERROR!")),
    "MONGODB_DB env var is missing!"
  );
  process.exit(1);
}

if (mongodbUri !== localhost && careful !== "yes") {
  console.error(
    chalk.bold(chalk.red("ERROR!")),
    chalk.bold("MONGODB_URI is set to:"),
    `'${process.env.MONGODB_URI}'`
  );
  console.error(
    "To proceed call this script with the 'careful' flag set to 'yes'."
  );
  console.error(
    "Otherwise, remove MONGODB_URI from env and the script will default to 'mongodb://localhost:27017'."
  );
  process.exit(1);
}

if (files.length === 0) {
  console.error(chalk.bold(chalk.red("ERROR!")), "No files provided!");
  process.exit(1);
}

const createUniqueIndex = async (collection, field) =>
  collection.createIndex({ [field]: 1 }, { unique: true });

const updateDb = async (promises) => {
  const promisesCollection = await getMongoDbCollection({
    mongodbUri,
    mongoDb,
    collection,
  });
  const index = await createUniqueIndex(promisesCollection, "osis");
  console.log(`Successfully created index ${index}!`);
  return promisesCollection.insertMany(promises, { ordered: false });
};

console.log("mongodbUri:", mongodbUri);
console.log("mongoDb:", mongoDb);
console.log("collection:", collection);
if (noSample || mongodbUri !== localhost) {
  console.log("noSample");
} else {
  console.log("sampleSize:", sampleSize);
}
rl.question("Do you want to proceed (y/N)? ", (r) => {
  if (r.toLocaleLowerCase() !== "y") {
    console.log("Operation cancelled!");
    process.exit();
  }
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
    .then((promises) => {
      if (noSample || mongodbUri !== localhost) {
        return updateDb(promises);
      }
      return updateDb(shuffle(promises).slice(0, sampleSize));
    })
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
});
