import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock parsePdf to avoid real PDF parsing
vi.mock("../src/pdf/parser", () => ({
  parsePdf: vi.fn().mockResolvedValue({
    type: "pdf",
    pageCount: 7,
    fileSize: 123,
    dimensions: { width: 100, height: 200 },
    encrypted: false,
    raw: {},
  }),
}));

// Mock child_process.execFile to simulate conversion success
vi.mock("child_process", () => ({
  execFile: (cmd: string, args: string[], opts: any, cb: any) => {
    if (typeof cb === "function") cb(null, { stdout: "" });
  },
}));

// Mock readFile to return a buffer (plugin reads the generated PDF)
vi.mock("fs/promises", async () => {
  const actual = await vi.importActual("fs/promises");
  return {
    ...actual,
    readFile: vi.fn().mockResolvedValue(Buffer.from("pdf")),
  };
});

import { registerLibreOfficeDocxPlugin } from "../src/plugins/docx-libreoffice";

describe("LibreOffice DOCX plugin (scaffold)", () => {
  it("registers parser and returns parsed pageCount", async () => {
    let captured: any;
    const reg = (ext: string, fn: any) => {
      captured = fn;
    };

    registerLibreOfficeDocxPlugin(reg, { sofficePath: "soffice" });

    expect(typeof captured).toBe("function");

    const fakeDocx = Buffer.from("PK\u0003\u0004 fake docx");

    const result = await captured(fakeDocx);

    expect(result.type).toBe("docx");
    expect(result.pageCount).toBe(7);
    expect(result.fileSize).toBe(fakeDocx.length);
  });
});
