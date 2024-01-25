export interface FileSystem {
  saveFile(path: string, content: string): Promise<void>;
}
