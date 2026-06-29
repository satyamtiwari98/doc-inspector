import { tmpdir } from "os";
import path from "path";
import { writeFile, readFile, unlink } from "fs/promises";
import { promisify } from "util";
import { parsePdf } from "../pdf/parser";
import type { DocumentInfo } from "../types";

export type LibreOfficeOptions = {
  timeoutMs?: number;
};
// execFile will be dynamically imported inside the parser so tests can
// mock `child_process` before this module executes the conversion.
/**
 * Registers a DOCX parser that uses LibreOffice to convert DOCX to PDF
 * and then counts pages from the generated PDF. This provides an
 * accuracy mode that is more faithful to rendered pagination.
 *
 * Usage:
 * import { registerParser } from 'doc-inspector';
 * import { registerLibreOfficeDocxPlugin } from './plugins/docx-libreoffice';
 * registerLibreOfficeDocxPlugin(registerParser, { sofficePath: '/usr/bin/soffice' });
 */
export function registerLibreOfficeDocxPlugin(
  registerParser: (
    ext: string,
    fn: (buffer: Buffer) => Promise<DocumentInfo>,
  ) => void,
  options: LibreOfficeOptions = {},
) {
  const soffice = options.sofficePath ?? "soffice";

  async function parser(buffer: Buffer): Promise<DocumentInfo> {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const base = path.join(tmpdir(), `doc-inspector-${id}`);
    const docxPath = base + ".docx";
    const pdfPath = base + ".pdf";

    try {
      await writeFile(docxPath, buffer);

      // Dynamically import execFile so tests can mock child_process.
      const { execFile } = await import("child_process");
      const execFileP = promisify(execFile as any);

      await execFileP(
        soffice,
        [
          "--headless",
          "--convert-to",
          "pdf",
          "--outdir",
          path.dirname(docxPath),
          docxPath,
        ],
        { timeout: options.timeoutMs ?? 30000 },
      );

      const pdfBuf = await readFile(pdfPath);

      const info = await parsePdf(pdfBuf);

      return {
        // present results as docx but with accurate pageCount
        type: "docx",
        pageCount: info.pageCount,
        fileSize: buffer.length,
        dimensions: info.dimensions,
        encrypted: info.encrypted,
        raw: { convertedFrom: "libreoffice", pdfRaw: info.raw },
      };
    } catch (err: any) {
      throw new Error(
        `LibreOffice conversion failed: ${err?.message ?? String(err)}`,
      );
    } finally {
      try {
        await unlink(docxPath);
      } catch {}
      try {
        await unlink(pdfPath);
      } catch {}
    }
  }

  registerParser("docx", parser);
}
