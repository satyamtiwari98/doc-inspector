export type Dimensions = { width: number; height: number } | null;

export type DocumentInfo = {
  type: string;
  pageCount?: number | null;
  slideCount?: number | null;
  fileSize: number;
  dimensions: Dimensions;
  encrypted?: boolean;
  // original raw info from parser
  raw?: any;
};

export type BlobLike = { arrayBuffer: () => Promise<ArrayBuffer> };

export type InputSource =
  | string
  | Buffer
  | Uint8Array
  | ArrayBuffer
  | BlobLike
  | NodeJS.ReadableStream;
