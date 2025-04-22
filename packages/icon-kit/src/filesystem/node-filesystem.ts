import type { Logger } from "../logger/logger.js";
import type { Filesystem } from "./filesystem.js";
import fs from "node:fs";

export class NodeFilesystem implements Filesystem {
  constructor(private readonly logger: Logger) {}

  createFile(path: string, content: string): void {
    fs.writeFileSync(path, content);

    this.logger.info(`Create file: ${path}`);
  }

  readFile(path: string): string {
    return fs.readFileSync(path, "utf-8");
  }
}
