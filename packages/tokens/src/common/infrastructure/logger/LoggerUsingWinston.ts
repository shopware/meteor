import winston from 'winston';
import { Logger } from '../../application/Logger.js';

export class LoggerUsingWinston implements Logger {
  private readonly logger = winston.createLogger();

  private runId: string | undefined = undefined;

  setRunId(id: string): void {
    const runIdAlreadySet = this.runId !== undefined;
    if (runIdAlreadySet) {
      throw new Error('Failed to set runId: runId already set.');
    }

    this.runId = id;
  }

  debug(data: Record<string, unknown>): void {
    if (!this.runId) throw new Error('Failed to log: runId is not set.');

    this.logger.debug({
      ...data,
      runId: this.runId,
    });
  }
}
