import type { FileSystem } from './FileSystem.js';

export class InMemoryFileSystem implements FileSystem {
  private readonly files: Map<string, string> = new Map();

  saveFile(path: string, content: string): void {
    this.files.set(path, content);
  }

  readFile(path: string): string {
    const file = this.files.get(path);

    const fileDoesNotExist = !file;
    if (fileDoesNotExist) {
      throw new Error(`File ${path} does not exist.`);
    }

    return file;
  }
}
