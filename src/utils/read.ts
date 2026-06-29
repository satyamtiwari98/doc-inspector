(async function () {})();

export async function toBuffer(input: any): Promise<Buffer> {
  // Buffer-like
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(input)) return input;

  // Uint8Array or ArrayBuffer
  if (input instanceof Uint8Array) return Buffer.from(input);
  if (input instanceof ArrayBuffer) return Buffer.from(new Uint8Array(input));

  // Blob / File (browser)
  if (typeof Blob !== "undefined" && input instanceof Blob) {
    const ab = await input.arrayBuffer();
    return Buffer.from(new Uint8Array(ab));
  }

  // Readable stream (Node)
  if (
    typeof input === "object" &&
    input !== null &&
    typeof input.on === "function" &&
    typeof input.read === "function"
  ) {
    const chunks: Buffer[] = [];
    for await (const chunk of input as AsyncIterable<
      Buffer | Uint8Array | string
    >) {
      if (typeof chunk === "string") chunks.push(Buffer.from(chunk));
      else if (chunk instanceof Uint8Array) chunks.push(Buffer.from(chunk));
      else chunks.push(chunk as Buffer);
    }
    return Buffer.concat(chunks);
  }

  // String path (Node) - dynamic import to avoid bundling fs into browser builds
  if (typeof input === "string") {
    // try Node fs
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = await import("fs/promises");
      return fs.readFile(input);
    } catch (err) {
      throw new Error(
        "String input is only supported in Node.js (as a file path)",
      );
    }
  }

  throw new Error("Unsupported input type");
}
