import firebase from "firebase/app";
import "firebase/functions";

const APP_NAME = "gods-promises";

const firebaseConfig = {
  apiKey: "AIzaSyBUG2Qt9Jg5hTTZAKbjLn0IxdoA1XlGiZk",
  authDomain: "promises-edfea.firebaseapp.com",
  projectId: "promises-edfea",
  storageBucket: "promises-edfea.appspot.com",
  messagingSenderId: "838543239018",
  appId: "1:838543239018:web:e967c86dc829edce226713",
};

export const app =
  firebase.app(APP_NAME) || firebase.initializeApp(firebaseConfig, APP_NAME);
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
