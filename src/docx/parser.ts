import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import { DocumentInfo } from "../types";

export async function parseDocx(buffer: Buffer): Promise<DocumentInfo> {
  const zip = await JSZip.loadAsync(buffer);

  const xml = await zip.file("docProps/app.xml")?.async("text");

  if (!xml) {
    return {
      type: "docx",
      pageCount: null,
      fileSize: buffer.length,
      dimensions: null,
      encrypted: false,
      raw: null,
    };
  }

  const parser = new XMLParser();

  const data = parser.parse(xml);

  return {
    type: "docx",
    pageCount: Number(data.Properties.Pages) || null,
    fileSize: buffer.length,
    dimensions: null,
    encrypted: false,
    raw: data,
  };
}
