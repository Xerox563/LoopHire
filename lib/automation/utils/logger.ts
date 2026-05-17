// lib/automation/utils/logger.ts

/**
 * Simple logger that will be used during automation.
 * In the context of Next.js API routes, we'll want to pipe these
 * logs to the stream.
 */

export interface LogProvider {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
}

// Default console logger
export const defaultLogger: LogProvider = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  warn: (msg: string) => console.warn(`[WARN] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
};

let currentLogger = defaultLogger;

export function setLogger(logger: LogProvider) {
  currentLogger = logger;
}

export const logger = {
  info: (msg: string) => currentLogger.info(msg),
  warn: (msg: string) => currentLogger.warn(msg),
  error: (msg: string) => currentLogger.error(msg),
};
