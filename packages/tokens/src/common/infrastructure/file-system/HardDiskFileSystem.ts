import type { FileSystem } from '../../domain/file-system/FileSystem.js';
import fs from 'node:fs';
import { dirname } from 'node:path';

export class HardDiskFileSystem implements FileSystem {
  saveFile(path: string, content: string): void {
    const directory = dirname(path);
    const needToCreateTargetDirectory = !fs.existsSync(directory);

    if (needToCreateTargetDirectory) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(path, content, { encoding: 'utf-8' });
  }
}
