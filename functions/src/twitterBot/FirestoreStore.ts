import admin from "firebase-admin";
import {DocumentReference} from "@google-cloud/firestore";
import {IStore} from "./IStore";

export default class FirebaseStore<T> implements IStore<T> {
  private _store: DocumentReference<FirebaseFirestore.DocumentData>;

  constructor(collection: string, doc: string) {
    this._store = admin.firestore().collection(collection).doc(doc);
  }

  async get(): Promise<T | undefined> {
    const doc = await this._store.get();
    const data = doc.data();
    return data as T | undefined;
  }

  async set(data: T): Promise<void> {
    await this._store.set(data);
    return;
  }
}
