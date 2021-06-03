require("dotenv").config();
const fs = require("fs").promises;
const admin = require("firebase-admin");

const [, , ...files] = process.argv;
if (files.length === 0) {
  console.error(`Please specify a file or files!`);
  process.exit(1);
}

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
const promisesCollection = db.collection("promises");

const updateDb = async (promises) => {
  let batch = db.batch();
  let batchCounter = 0;
  const ids = [];

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
    // const uniqueOsis = [...new Set(allPromises.map(({ osis }) => osis))];
    // const uniquePromises = uniqueOsis.map((osis) =>
    //   allPromises.find((promise) => promise.osis === osis)
    // );
    return updateDb(allPromises);
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
    const osis = snap.docs.map((doc) => doc.data().osis);
    const uniques = [...new Set(osis)];
    const freq = new Map();
    osis.forEach((o) => {
      if (freq.has(o)) {
        freq.set(o, freq.get(o) + 1);
      } else {
        freq.set(o, 1);
      }
    });
    const dups = Array.from(freq.keys()).filter((key) => freq.get(key) > 1);
    const [firstDup] = dups;
    console.log(firstDup);
    console.log(dups.length, uniques.length);
    console.log({ collection: snap.size, ids: index.data().ids.length });
    return promisesCollection.where("osis", "==", firstDup).get();
  })
  .then((pp) => {
    console.log(
      "🙋‍♂️",
      pp.docs.forEach((d) => {
        console.log(d.data());
      })
    );
    process.exit();
  })
  .catch((err) => {
    process.exit(1);
  });
