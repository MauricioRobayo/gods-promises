import axios from "axios";
import {ExternalApi, BibleId} from "./interface";
import {JSDOM} from "jsdom";
import {https, logger} from "firebase-functions";

type Result = {
  content: string;
};

type Response = {
  data: {
    passages: Result[];
  };
};

class ApiBible implements ExternalApi {
  constructor(private apiKey: string) {}

  #bibleIdMap = {
    kjv: "de4e12af7f28f599-01",
    rv_1909: "592420522e16049f-01",
  };

  async getPassageFromReference(
    bibleId: BibleId,
    reference: string
  ): Promise<string> {
    const apiBibleId = this.#bibleIdMap[bibleId];
    const url = `https://api.scripture.api.bible/v1/bibles/${apiBibleId}/search?query=${reference}`;
    const {data} = await axios(url, {headers: {"api-key": this.apiKey}});
    return this.buildTextFromResponse(data);
  }

  private buildTextFromResponse(response: Response): string {
    const html = response.data.passages
      .map((passage) => passage.content)
      .join("\n");
    const {window} = new JSDOM(html);
    const p = window.document.querySelector("p");
    if (!p) {
      logger.error("Could not find 'p' element on returned content");
      throw new https.HttpsError(
        "internal",
        "Error fetching reference from Api"
      );
    }
    let text = "";
    p.childNodes.forEach((childNode) => {
      if (childNode.nodeType === 3) {
        text += `\n${childNode.textContent}`;
      }
    });

    return text.trim();
  }
}

export default ApiBible;
