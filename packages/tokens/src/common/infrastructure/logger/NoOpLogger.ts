import { Logger } from '../../application/Logger.js';

export class NoOpLogger implements Logger {
  setRunId(): void {}

  debug() {}
}
