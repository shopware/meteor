import type { Logger } from "./logger.js";

import winston, { type Logger as Winston } from "winston";

export class WinstonLogger implements Logger {
  private logger: Winston;

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      transports: [new winston.transports.File({ filename: "run.log" })],
    });
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, meta);
  }
}
