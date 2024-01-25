import type { FileSystem } from "../../domain/file-system/FileSystem";
import fs from "node:fs";

export class HardDiskFileSystem implements FileSystem {
  saveFile(path: string, content: string): Promise<void> {
    fs.writeFileSync(path, content, { encoding: "utf-8" });
  }
}
