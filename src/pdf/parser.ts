import { PDFDocument } from "pdf-lib";
import { DocumentInfo } from "../types";

export async function parsePdf(buffer: Buffer): Promise<DocumentInfo> {
  const pdf = await PDFDocument.load(buffer);

  const pageCount = pdf.getPageCount();
  const first = pdf.getPage(0);
  const size = first.getSize();

  return {
    type: "pdf",
    pageCount,
    fileSize: buffer.length,
    dimensions: { width: size.width, height: size.height },
    encrypted: false,
    raw: { pages: pageCount },
  };
}
