require("dotenv").config();
const fs = require("fs").promises;
const { MongoClient } = require("mongodb");
const osisToEn = require("bible-reference-formatter");
const bcv_parser =
  require("bible-passage-reference-parser/js/en_bcv_parser").bcv_parser;

const bcv = new bcv_parser();

async function writeData(promises, filename) {
  const dataDir = `${__dirname}/scrapped-data`;
  const filePath = `${dataDir}/${filename}`;

  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(promises));
    console.log(`wrote ${promises.length} promises to ${filePath}`);
  } catch (err) {
    console.log(`writeData: ${JSON.stringify(err)}`);
  }
}

const getMongoDbCollection = async ({ mongodbUri, mongoDb, collection }) => {
  const client = new MongoClient(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(mongoDb);
  return db.collection(collection);
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i + 1);
    [array[i], array[randomPosition]] = [array[randomPosition], array[i]];
  }
  return array;
};

const makeGPromiseOrThrow = (options) => {
  const requirements = ["niv", "osis", "source"];
  requirements.forEach((requirement) => {
    const option = options[requirement];
    if (!option || !typeof option === "string" || option.trim() === "") {
      throw new Error(`makePromise: missing required '${requirement}'`);
    }
  });
  const { osis, niv, source } = options;
  return {
    niv,
    osis,
    source,
  };
};

const osisToNivLong = (osis) => osisToEn("niv-long", osis);

const makeGPromise = ({ reference, source }) => {
  try {
    const osis = bcv.parse(reference).osis();
    const niv = osisToNivLong(osis);
    if (!niv.includes(":")) {
      console.log(`Skipping '${niv}', full chapter and no specific verses.`);
      return null;
    }
    return makeGPromiseOrThrow({
      niv,
      osis,
      source,
    });
  } catch (err) {
    console.log(`makePromise failed on reference '${reference}'`, err);
    return null;
  }
};

function getReferences(data, source) {
  const refs = bcv.parse(data).osis().split(",");
  const promises = refs.map((reference) =>
    makeGPromise({
      reference,
      source,
    })
  );
  return promises;
}

exports.shuffle = shuffle;
exports.makeGPromise = makeGPromise;
exports.getReferences = getReferences;
exports.getMongoDbCollection = getMongoDbCollection;
exports.writeData = writeData;
