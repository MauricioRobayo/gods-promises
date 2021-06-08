import * as osisToEn from "bible-reference-formatter";
import * as functions from "firebase-functions";
import {MongoClient, Collection} from "mongodb";
import {IBasePromise, Content} from "../types";

export const osisToHumanReadableReference = (osis: string): string | null => {
  try {
    return osisToEn("niv-long", osis).replace(/–/g, "-");
  } catch (err) {
    functions.logger.error(
      `osisToHumanReadableReference: ${JSON.stringify(err)}`
    );
    return null;
  }
};

const config = functions.config();

export const getMongoDbCollection = async (
  collection: string
): Promise<Collection> => {
  const client = new MongoClient(config.mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(config.mongodb.database);
  return db.collection(collection);
};

export const getRandomPromises = async (
  size: number
): Promise<
  (IBasePromise & {
    content?: Content;
  })[]
> => {
  const collection = await getMongoDbCollection("gpromises");
  const cursor = collection.aggregate<
    IBasePromise & {
      content?: Content;
    }
  >([{$match: {errors: {$exists: false}}}, {$sample: {size}}]);
  return cursor.toArray();
};

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
