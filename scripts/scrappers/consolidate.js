require("dotenv").config();
const fs = require("fs").promises;
const admin = require("firebase-admin");
const p1 = require("./scrapped-data/300-promises.json");
const p2 = require("./scrapped-data/all-promises.json");
const p3 = require("./scrapped-data/selected-promises.json");
const p4 = require("./scrapped-data/160-promises.json");

const firebaseCredential = process.env.FIREBASE_CREDENTIAL;
const firestoreEmulatorHost = process.env.FIRESTORE_EMULATOR_HOST;
const projectId = process.env.PROJECT_ID;

if (firestoreEmulatorHost && projectId) {
  console.log("Using emulator...");
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
const promises = [...p1, ...p2, ...p3, ...p4];
const allPromises = promises.map(({ bookId, ref }) => `${bookId} ${ref}`);
const uniquePromises = [...new Set(allPromises)];
const indexRef = db.collection("promises").doc("index");
const doc = { references: uniquePromises, count: uniquePromises.length };
Promise.all([
  fs.writeFile("promises.json", JSON.stringify(doc)),
  indexRef.set(doc),
]);
