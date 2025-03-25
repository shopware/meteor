export interface Filesystem {
  createFile(path: string, content: string): void;

  readFile(path: string): string | undefined;

  createDirectory(path: string): void;
}
