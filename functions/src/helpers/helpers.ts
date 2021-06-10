import * as functions from "firebase-functions";
import {MongoClient, Collection} from "mongodb";
import {Content, GPromise, IGPromise} from "../models/GPromise";
import {Lang, BibleIds, BibleId} from "../types";
import {bibleIds, bibles} from "../config";
import {BibleSuperSearch} from "../GPromises/api";

export const translator = (lang: Lang, reference: string): string => {
  switch (lang) {
    case "es":
      return nivLongToSpanish(reference);
    case "en":
    default:
      return reference;
  }
};

export const updateMissingContent = async (
  gPromise: GPromise,
  gPromisesCollection: Collection<IGPromise>
): Promise<GPromise> => {
  const bibleSuperSearch = new BibleSuperSearch(bibles, translator);
  const missingBibleIds = getMissingBibles(bibleIds, gPromise.content);

  if (missingBibleIds.length === 0) {
    return gPromise;
  }

  const content = await bibleSuperSearch.getPassageFromReference(
    missingBibleIds,
    gPromise.niv
  );
  const newContent = gPromise.content
    ? {
        ...gPromise.content,
        ...content,
      }
    : content;
  await gPromisesCollection.updateOne(
    {_id: gPromise._id},
    {
      $set: {
        content: newContent,
      },
    }
  );
  gPromise.content = newContent;
  return gPromise;
};

export function getMissingKeysInObject<T extends string>(
  ids: T[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any> = {}
): T[] {
  const objectKeys = Object.keys(content);
  const missingKeys = [];
  for (const key of ids) {
    if (!objectKeys.includes(key)) {
      missingKeys.push(key);
    }
  }
  return missingKeys;
}

export const getMissingBibles = (
  bibles: BibleIds,
  content: Content
): BibleId[] => getMissingKeysInObject(bibles as unknown as BibleId[], content);

export const cleanPassage = (passage: string): string => {
  const cleanedText = passage
    .replace("¶", "")
    .trim()
    .replace(/[^\w?!'"]$/, ".");
  return /\w$/.test(cleanedText) ? `${cleanedText}.` : cleanedText;
};

const config = functions.config();

export async function getMongoDbCollection<T>(
  collection: string
): Promise<Collection<T>> {
  const client = new MongoClient(config.mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(config.mongodb.database);
  return db.collection<T>(collection);
}

export const nivLongToSpanish = (passage: string): string => {
  const translation: Record<string, string> = {
    Genesis: "Génesis",
    Exodus: "Éxodo",
    Leviticus: "Levítico",
    Numbers: "Números",
    Deuteronomy: "Deuteronomio",
    Joshua: "Josué",
    Judges: "Jueces",
    Ruth: "Rut",
    "1 Samuel": "1 Samuel",
    "2 Samuel": "2 Samuel",
    "1 Kings": "1 Reyes",
    "2 Kings": "2 Reyes",
    "1 Chronicles": "1 Crónicas",
    "2 Chronicles": "2 Crónicas",
    Ezra: "Esdras",
    Nehemiah: "Nehemías",
    Esther: "Ester",
    Job: "Job",
    Psalm: "Salmos",
    Proverbs: "Proverbios",
    Ecclesiastes: "Eclesiastés",
    "Song of Songs": "Cantares",
    Isaiah: "Isaías",
    Jeremiah: "Jeremías",
    Lamentations: "Lamentaciones",
    Ezekiel: "Ezequiel",
    Daniel: "Daniel",
    Hosea: "Oseas",
    Joel: "Joel",
    Amos: "Amós",
    Obadiah: "Abdías	1",
    Jonah: "Jonás",
    Micah: "Miqueas",
    Nahum: "Nahúm",
    Habakkuk: "Habacuc",
    Zephaniah: "Sofonías",
    Haggai: "Hageo",
    Zechariah: "Zacarías",
    Malachi: "Malaquías",
    Matthew: "Mateo",
    Mark: "Marcos",
    Luke: "Lucas",
    John: "Juan",
    Acts: "Hechos",
    Romans: "Romanos",
    "1 Corinthians": "1 Corintios",
    "2 Corinthians": "2 Corintios",
    Galatians: "Gálatas",
    Ephesians: "Efesios",
    Philippians: "Filipenses",
    Colossians: "Colosenses",
    "1 Thessalonians": "1 Tesalonicenses",
    "2 Thessalonians": "2 Tesalonicenses",
    "1 Timothy": "1 Timoteo",
    "2 Timothy": "2 Timoteo",
    Titus: "Tito",
    Philemon: "Filemón",
    Hebrews: "Hebreos",
    James: "Santiago",
    "1 Peter": "1 Pedro",
    "2 Peter": "2 Pedro",
    "1 John": "1 Juan",
    "2 John": "2 Juan",
    "3 John": "3 Juan",
    Jude: "Judas",
    Revelation: "Apocalipsis",
  };

  let translatedPassage = passage;

  Object.entries(translation).forEach(([en, es]) => {
    const regexp = new RegExp(en, "g");
    translatedPassage = translatedPassage.replace(regexp, es);
  });

  if (passage === translatedPassage) {
    throw new Error(`Could not find spanish translation for ${passage}!`);
  }

  return translatedPassage;
};
