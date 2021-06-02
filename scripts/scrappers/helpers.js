require("dotenv").config();
const booksEn = require("./books-en.json");

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i + 1);
    [arr[i], arr[randomPosition]] = [arr[randomPosition], arr[i]];
  }
  return arr;
};

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

exports.shuffle = shuffle;
exports.getBookId = getBookId;
exports.getStandardBookName = getStandardBookName;
