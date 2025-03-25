import type { Filesystem } from "./filesystem.js";

type Entry =
  | {
      type: "file";
      content: string;
    }
  | {
      type: "directory";
    };

export class InMemoryFilesystem implements Filesystem {
  private files: Record<string, Entry> = {};

  createFile(path: string, content: string) {
    this.files[path] = {
      type: "file",
      content,
    };
  }

  readFile(path: string): string | undefined {
    const entry = this.files[path];
    if (entry?.type === "file") {
      return entry.content;
    }

    return undefined;
  }

  createDirectory(path: string) {
    this.files[path] = {
      type: "directory",
    };
  }

  removeDirectory(path: string) {
    delete this.files[path];
  }
}
