require("dotenv").config();
const admin = require("firebase-admin");
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

const writeToFirebase = async (promises) => {
  const firebaseCredential = process.env.FIREBASE_CREDENTIAL;

  if (!firebaseCredential) {
    throw new Error("Could not find firebase credential!");
  }

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(firebaseCredential)),
    databaseURL: "https://promises-edfea.firebaseio.com",
  });

  const db = admin.firestore();

  let batchCounter = 1;
  let batch = db.batch();
  for (promise of promises) {
    try {
      const docRef = db.collection("promises").doc(promise);
      batch.create(docRef, {});

      if (batchCounter >= 500) {
        await batch.commit();
        batch = db.batch();
        batchCounter = 1;
        continue;
      }
    } catch (err) {
      console.log(`Could not write '${promise}' to firestore!`);
    }
    batchCounter++;
  }

  if (batchCounter < 500) {
    try {
      await batch.commit();
    } catch (err) {
      console.log(err);
    }
  }

  const snap = await db.collection("promises").get();
  console.log(`Promises collection size is ${snap.size}`);
};

exports.getBookId = getBookId;
exports.getStandardBookName = getStandardBookName;
exports.writeToFirebase = writeToFirebase;
