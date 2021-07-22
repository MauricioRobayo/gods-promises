import firebase from "firebase/app";
import "firebase/functions";

const APP_NAME = "gods-promises";

const config = {
  apiKey: "AIzaSyBUG2Qt9Jg5hTTZAKbjLn0IxdoA1XlGiZk",
  authDomain: "promises-edfea.firebaseapp.com",
  projectId: "promises-edfea",
  storageBucket: "promises-edfea.appspot.com",
  messagingSenderId: "838543239018",
  appId: "1:838543239018:web:e967c86dc829edce226713",
};

let app: firebase.app.App;

try {
  app = firebase.app(APP_NAME);
} catch (_) {
  app = firebase.initializeApp(config, APP_NAME);
}

export const functions = app.functions();
export function firebaseCallable<T, R = undefined>(
  name: string
): (data?: R) => Promise<T> {
  const callable = functions.httpsCallable(name);
  return async (data) => (await callable(data)).data;
}

if (process.env.NODE_ENV === "development") {
  functions.useEmulator("127.0.0.1", 5001);
}
