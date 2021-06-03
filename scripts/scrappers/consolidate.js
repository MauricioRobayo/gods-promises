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
const uniqueReferences = [
  ...new Set(promises.map(({ reference }) => reference)),
];

if (firestoreEmulatorHost && projectId) {
  // shuffle(uniqueReferences).splice(5);
  console.log(
    `Using emulator, inserting ${uniqueReferences.length} random docs!`
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
const promisesCollection = db.collection("promises");

const uniquePromises = uniqueReferences.map((uniqueReference) =>
  promises.find(({ reference }) => reference === uniqueReference)
);

const writeInBatches = async (promises) => {
  let batch = db.batch();
  let batchCounter = 0;
  const ids = [];

  for (const promise of promises) {
    const { reference } = promise;
    const querySnapShot = await promisesCollection
      .where("reference", "==", reference)
      .get();
    if (querySnapShot.docs.length > 0) {
      ids.push(querySnapShot.docs[0].id);
      continue;
    }
    const docRef = promisesCollection.doc();
    ids.push(docRef.id);
    batch.set(docRef, promise);
    batchCounter++;
    if (batchCounter === 500) {
      await batch.commit();
      batch = db.batch();
      batchCounter = 0;
    }
  }

  if (batchCounter < 500) {
    await batch.commit();
  }

  return ids;
};

writeInBatches(uniquePromises)
  .then((ids) => {
    const indexRef = promisesCollection.doc("index");
    const doc = {
      ids: ids,
      count: ids.length,
    };
    return Promise.all([ids, indexRef.set(doc)]);
  })
  .then(([ids]) => {
    return Promise.all([promisesCollection.get(), ids]);
  })
  .then(([snap, ids]) => {
    console.log({ collection: snap.size, ids: ids.length });
    process.exit();
  })
  .catch((err) => console.log(err));
