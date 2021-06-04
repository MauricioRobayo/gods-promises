require("dotenv").config();
const { MongoClient } = require("mongodb");

const bcv_parser =
  require("bible-passage-reference-parser/js/en_bcv_parser").bcv_parser;
const booksEn = require("./books-en.json");

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

const getBookIdOrThrow = (bookName) => {
  const book = booksEn.find(
    ({ name }) => name.trim().toLowerCase() === bookName.trim().toLowerCase()
  );
  if (!book) {
    throw new Error(`could not find apiBibleBookId for book '${bookName}'!`);
  }
  return book.id;
};

const getStandardBookName = (naiveName, namesMap) => {
  if (namesMap[naiveName]) {
    return namesMap[naiveName].trim().toLowerCase();
  }

  return naiveName.trim().toLowerCase();
};

const parseReferenceOrThrow = (reference) => {
  const bcvRef = bcv.parse(reference);
  const { entities, passage } = bcvRef;

  if (entities.length === 0) {
    throw new Error(`No entities found for reference '${reference}'`);
  }

  if (passage.books.length === 0) {
    throw new Error(`No books found for reference '${reference}'`);
  }

  const passages = entities[0].passages
    .filter((passage) => passage.valid.valid && passage.type !== "b")
    .map(({ start, end }) => ({
      start: { b: start.b, c: start.c, v: start.v },
      end: { b: end.b, c: end.c, v: end.v },
    }));
  const book = passage.books[0].value;
  const osis = bcvRef.osis();
  return { passages, osis, book };
};

const makePromiseOrThrow = (options) => {
  const requirements = ["passages", "osis", "bookId", "reference", "source"];
  requirements.forEach((requirement) => {
    if (!options[requirement] || options[requirement].length === 0) {
      throw new Error(`makePromise: missing required '${requirement}'`);
    }
  });
  const { passages, osis, bookId, reference, source } = options;
  return {
    passages,
    osis,
    apiBibleBookId: bookId,
    originalReference: reference,
    source,
  };
};

const makePromise = ({ reference, source, booksMap }) => {
  try {
    const { book, passages, osis } = parseReferenceOrThrow(reference);
    const bookId = getBookIdOrThrow(getStandardBookName(book, booksMap));
    return makePromiseOrThrow({
      passages,
      osis,
      bookId,
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
