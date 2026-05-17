// lib/automation/utils/retry.ts

import { logger } from "./logger";

export interface RetryOptions {
  maxAttempts: number;
  delayMs?: number;
  backoffFactor?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { maxAttempts, delayMs = 1000, backoffFactor = 2 } = options;
  let lastError: Error = new Error("Unknown error");

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt === maxAttempts) break;

      const waitMs = delayMs * Math.pow(backoffFactor, attempt - 1);
      logger.warn(
        `Attempt ${attempt}/${maxAttempts} failed: ${lastError.message}. Retrying in ${waitMs}ms...`
      );

      if (options.onRetry) {
        options.onRetry(attempt, lastError);
      }

      await sleep(waitMs);
    }
  }

  throw lastError;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function humanDelay(baseMs: number, jitterMs = 400): Promise<void> {
  const jitter = Math.floor(Math.random() * jitterMs);
  return sleep(baseMs + jitter);
}
