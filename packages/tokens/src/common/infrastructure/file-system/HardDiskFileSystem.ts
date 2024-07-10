import type { FileSystem } from '../../domain/file-system/FileSystem.js';
import fs from 'node:fs';
import { dirname } from 'node:path';
import { Logger } from '../../application/Logger.js';

export class HardDiskFileSystem implements FileSystem {
  constructor(private readonly logger: Logger) {}

  saveFile(path: string, content: string): void {
    const directory = dirname(path);
    const needToCreateTargetDirectory = !fs.existsSync(directory);

    if (needToCreateTargetDirectory) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(path, content, { encoding: 'utf-8' });

    this.logger.debug({
      id: 'file-saved',
      data: {
        path,
        content,
      },
    });
  }
}
