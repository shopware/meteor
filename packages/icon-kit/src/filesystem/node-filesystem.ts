import type { Filesystem } from "./filesystem.js";
import fs from "node:fs";

export class NodeFilesystem implements Filesystem {
  createFile(path: string, content: string): void {
    fs.writeFileSync(path, content);
  }

  readFile(path: string): string {
    return fs.readFileSync(path, "utf-8");
  }
}
