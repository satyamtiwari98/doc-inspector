import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import { DocumentInfo } from "../types";

export async function parsePptx(buffer: Buffer): Promise<DocumentInfo> {
  const zip = await JSZip.loadAsync(buffer);

  const slides = Object.keys(zip.files).filter((f) =>
    /^ppt\/slides\/slide\d+\.xml$/.test(f),
  );

  const xml = await zip.file("ppt/presentation.xml")!.async("text");

  const parser = new XMLParser({
    ignoreAttributes: false,
  });

  const data = parser.parse(xml);

  const size = data["p:presentation"]["p:sldSz"];

  return {
    type: "pptx",
    slideCount: slides.length,
    fileSize: buffer.length,
    dimensions: { width: Number(size["@_cx"]), height: Number(size["@_cy"]) },
    encrypted: false,
    raw: data,
  };
}
