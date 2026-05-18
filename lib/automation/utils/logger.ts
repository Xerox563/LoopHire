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
  prompt?: (msg: string) => Promise<boolean>;
}

// Default console logger
export const defaultLogger: LogProvider = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  warn: (msg: string) => console.warn(`[WARN] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
  prompt: async (msg: string) => {
    console.log(`[PROMPT] ${msg}`);
    return true; // Auto-confirm in console
  }
};

let currentLogger = defaultLogger;

export function setLogger(logger: LogProvider) {
  currentLogger = logger;
}

export const logger = {
  info: (msg: string) => currentLogger.info(msg),
  warn: (msg: string) => currentLogger.warn(msg),
  error: (msg: string) => currentLogger.error(msg),
  prompt: (msg: string) => currentLogger.prompt ? currentLogger.prompt(msg) : Promise.resolve(true),
};
