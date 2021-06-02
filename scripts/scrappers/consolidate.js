require("dotenv").config();
const admin = require("firebase-admin");
const { shuffle } = require("./helpers");
const p1 = require("./scrapped-data/300-promises.json");
const p2 = require("./scrapped-data/all-promises.json");
const p3 = require("./scrapped-data/selected-promises.json");
const p4 = require("./scrapped-data/160-promises.json");

const firebaseCredential = process.env.FIREBASE_CREDENTIAL;
const firestoreEmulatorHost = process.env.FIRESTORE_EMULATOR_HOST;
const projectId = process.env.PROJECT_ID;
const promises = [...p1, ...p2, ...p3, ...p4];

if (firestoreEmulatorHost && projectId) {
  shuffle(promises).splice(5);
  console.log(
    `Using emulator, inserting demo data ${JSON.stringify(promises, null, 2)}`
  );
  admin.initializeApp({ projectId });
} else if (firebaseCredential) {
  console.log("Using production...");
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(firebaseCredential)),
  });
} else {
  throw new Error("Could not load emulator neither production!");
}

const db = admin.firestore();
const allPromises = promises.map(({ bookId, ref }) => `${bookId} ${ref}`);
const uniquePromises = [...new Set(allPromises)];
const indexRef = db.collection("promises").doc("index");
const doc = { references: uniquePromises, count: uniquePromises.length };
indexRef.set(doc).then(() => process.exit());
