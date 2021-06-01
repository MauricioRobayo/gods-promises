require("dotenv").config();
const booksEn = require("./books-en.json");

const getBookId = (bookName) => {
  const book = booksEn.find(
    ({ name }) => name.trim().toLowerCase() === bookName.trim().toLowerCase()
  );
  if (!book) {
    console.log(`could not find id for book '${bookName}'!`);
    return null;
  }
  return book.id;
};

const getStandardBookName = (naiveName, namesMap) => {
  if (namesMap[naiveName]) {
    return namesMap[naiveName].trim().toLowerCase();
  }

  return naiveName.trim().toLowerCase();
};

exports.getBookId = getBookId;
exports.getStandardBookName = getStandardBookName;
