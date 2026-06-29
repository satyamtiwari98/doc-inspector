import { inspect, registerParser } from "../src/index";
import { registerLibreOfficeDocxPlugin } from "../src/plugins/docx-libreoffice";

// Register the plugin (provide soffice path if not on PATH)
registerLibreOfficeDocxPlugin(registerParser, { sofficePath: "soffice" });

async function run() {
  const info = await inspect("/path/to/document.docx");
  console.log(info);
}

run().catch((err) => console.error(err));
