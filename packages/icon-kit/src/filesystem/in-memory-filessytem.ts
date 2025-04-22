import type { Filesystem } from "./filesystem.js";

export class InMemoryFilesystem implements Filesystem {
  private files: Record<string, string> = {};

  createFile(path: string, content: string) {
    this.files[path] = content;
  }

  readFile(path: string) {
    return this.files[path];
  }
}
