require("dotenv").config();
const { MongoClient } = require("mongodb");
const osisToEn = require("bible-reference-formatter");
const bcv_parser =
  require("bible-passage-reference-parser/js/en_bcv_parser").bcv_parser;

const bcv = new bcv_parser();

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

const makePromiseOrThrow = (options) => {
  const requirements = ["niv", "originalReference", "osis", "source"];
  requirements.forEach((requirement) => {
    const option = options[requirement];
    if (!option || !typeof option === "string" || option.trim() === "") {
      throw new Error(`makePromise: missing required '${requirement}'`);
    }
  });
  const { osis, originalReference, niv, source } = options;
  return {
    niv,
    originalReference,
    osis,
    source,
  };
};

const osisToNivLong = (osis) => osisToEn("niv-long", osis);

const makePromise = ({ reference, source }) => {
  try {
    const osis = bcv.parse(reference).osis();
    const niv = osisToNivLong(osis);
    return makePromiseOrThrow({
      niv,
      originalReference: reference,
      osis,
      source,
    });
  } catch (err) {
    console.log(`makePromise failed on reference '${reference}'`, err);
    return null;
  }
};

exports.shuffle = shuffle;
exports.makePromise = makePromise;
exports.getMongoDbCollection = getMongoDbCollection;
