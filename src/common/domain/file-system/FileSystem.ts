export interface FileSystem {
  saveFile(path: string, content: string): void;
}
