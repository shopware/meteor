import type { Logger } from "./logger.js";

export class NoOpLogger implements Logger {
  info(): void {}
}
