export interface Logger {
  setRunId(id: string): void;

  debug(data: Record<string, unknown>): void;
}
