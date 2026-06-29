# doc-inspector

Lightweight inspector to get size and page/slide counts for PDF, DOCX and PPTX files.

Installation

```
npm install doc-inspector
```

Usage

```js
import { inspect } from "doc-inspector"; // ESM
// const { inspect } = require('doc-inspector'); // CJS

(async () => {
  const info = await inspect("path/to/file.pdf");
  console.log(info);
})();
```

Return value sample

- PDF: `{ type: 'pdf', pages: 10, width: 595.28, height: 841.89, size: 12345 }`
- DOCX: `{ type: 'docx', pages: 5, size: 34567 }` (pages may be null when not available)
- PPTX: `{ type: 'pptx', slides: 12, width: 9144000, height: 6858000, size: 45678 }`

Building from source

```
npm install
npm run build
```

LibreOffice accuracy plugin

If you need an exact DOCX page count that matches rendered pagination, you can use the LibreOffice plugin which converts DOCX to PDF and counts pages from the rendered PDF.

Important caveats:

- This plugin requires `soffice` (LibreOffice) to be installed and available in PATH or provided via `sofficePath`.
- Conversion is performed using a temporary file and shelling out to `soffice`.
- This is slower and requires native dependencies — it's intended as an optional accuracy mode.

Example (register plugin):

```ts
import { registerParser, inspect } from "doc-inspector";
import { registerLibreOfficeDocxPlugin } from "./src/plugins/docx-libreoffice";

registerLibreOfficeDocxPlugin(registerParser, {
  sofficePath: "/usr/bin/soffice",
});

const info = await inspect("path/to/file.docx");
```
