require("dotenv").config();
const {MongoClient} = require("mongodb");

const bcv_parser =
  require("bible-passage-reference-parser/js/en_bcv_parser").bcv_parser;

const bcv = new bcv_parser();

const getMongoDbCollection = async (collection) => {
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  return db.collection(collection);
};

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i + 1);
    [arr[i], arr[randomPosition]] = [arr[randomPosition], arr[i]];
  }
  return arr;
};

const makePromiseOrThrow = (options) => {
  const requirements = ["osis", "reference", "source"];
  requirements.forEach((requirement) => {
    const option = options[requirement];
    if (!option || !typeof option === "string" || option.trim() === "") {
      throw new Error(`makePromise: missing required '${requirement}'`);
    }
  });
  const {osis, reference, source} = options;
  return {
    osis,
    originalReference: reference,
    source,
  };
};

const makePromise = ({reference, source}) => {
  try {
    const osis = bcv.parse(reference).osis();
    return makePromiseOrThrow({
      osis,
      reference,
      source,
    });
  } catch (err) {
    console.log(
      `makePromise failed on reference '${reference}': ${err.message}`
    );
    return null;
  }
};

exports.shuffle = shuffle;
exports.makePromise = makePromise;
exports.getMongoDbCollection = getMongoDbCollection;
