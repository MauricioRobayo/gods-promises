require("dotenv").config();
const fs = require("fs").promises;
const admin = require("firebase-admin");

const [, , ...files] = process.argv;
if (files.length === 0) {
  console.error(`Please specify a file or files!`);
  process.exit(1);
}

if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log("Using emulator...");
  admin.initializeApp({ projectId: "promises-edfea" });
} else {
  console.log("Using production...");
  admin.initializeApp();
}

const db = admin.firestore();
const promisesCollection = db.collection("promises");

const updateDb = async (promises) => {
  let batch = db.batch();
  let batchCounter = 0;
  const index = await promisesCollection.doc("index").get();
  const ids = index.data() ? index.data().ids : [];

  for (const promise of promises) {
    const { osis } = promise;
    const querySnapShot = await promisesCollection
      .where("osis", "==", osis)
      .get();
    if (querySnapShot.docs.length > 0) {
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

Promise.all(files.map((file) => fs.readFile(file)))
  .then((filesData) => {
    const allPromises = filesData
      .map((fileData) => JSON.parse(fileData))
      .flat();
    const uniqueOsis = [...new Set(allPromises.map(({ osis }) => osis))];
    const uniquePromises = uniqueOsis.map((osis) =>
      allPromises.find((promise) => promise.osis === osis)
    );
    return updateDb(uniquePromises);
  })
  .then((ids) =>
    promisesCollection.doc("index").set({ count: ids.length, ids })
  )
  .then(() =>
    Promise.all([
      promisesCollection.get(),
      promisesCollection.doc("index").get(),
    ])
  )
  .then(([snap, index]) => {
    console.log({ collection: snap.size, ids: index.data().ids.length });
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
