import { detect } from "./utils/detect";
import { parsePdf } from "./pdf/parser";
import { parseDocx } from "./docx/parser";
import { parsePptx } from "./pptx/parser";
import { toBuffer } from "./utils/read";
import type { InputSource, DocumentInfo } from "./types";

type ParserFn = (buffer: Buffer) => Promise<DocumentInfo>;

const parsers: Map<string, ParserFn> = new Map([
  ["pdf", parsePdf as ParserFn],
  ["docx", parseDocx as ParserFn],
  ["pptx", parsePptx as ParserFn],
]);

export function registerParser(ext: string, fn: ParserFn) {
  parsers.set(ext, fn);
}

export async function inspect(input: InputSource): Promise<DocumentInfo> {
  const buffer = await toBuffer(input);

  const ext = await detect(buffer);

  const parser = parsers.get(ext);

  if (!parser) throw new Error("Unsupported document");

  return parser(buffer);
}
