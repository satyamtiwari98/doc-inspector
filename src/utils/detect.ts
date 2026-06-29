import { fileTypeFromBuffer } from "file-type";

export async function detect(buffer: Buffer) {
  const type = await fileTypeFromBuffer(buffer);

  if (!type) throw new Error("Unknown file");

  return type.ext;
}
