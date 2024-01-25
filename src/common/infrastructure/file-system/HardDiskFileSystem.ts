import type { FileSystem } from "../../domain/file-system/FileSystem";
import fs from "node:fs";

export class HardDiskFileSystem implements FileSystem {
  saveFile(path: string, content: string): void {
    fs.writeFileSync(path, content, { encoding: "utf-8" });
  }
}
