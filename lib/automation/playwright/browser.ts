// lib/automation/playwright/browser.ts

import { Browser, BrowserContext, chromium } from "playwright";
import path from "path";
import fs from "fs";
import { logger } from "../utils/logger";

const STORAGE_DIR = path.resolve("storage");
const STATE_PATH = path.join(STORAGE_DIR, "state.json");

export interface BrowserSession {
  browser: Browser;
  context: BrowserContext;
}

export async function launchBrowser(headless: boolean): Promise<BrowserSession> {
  logger.info(`Launching browser (headless: ${headless})`);

  const browser = await chromium.launch({
    headless,
    args: [
      "--no-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-dev-shm-usage",
    ],
  });

  const contextOptions: Parameters<Browser["newContext"]>[0] = {
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
    locale: "en-US",
    timezoneId: "America/New_York",
  };

  // Load persisted session state if it exists
  if (fs.existsSync(STATE_PATH)) {
    logger.info("Loading persisted browser session from state.json");
    contextOptions.storageState = STATE_PATH;
  } else {
    logger.info("No saved session found — starting fresh");
  }

  const context = await browser.newContext(contextOptions);

  // Hide automation signals
  await context.addInitScript(() => {
    const nav = (globalThis as any).navigator;
    if (nav) Object.defineProperty(nav, "webdriver", { get: () => undefined });
  });

  return { browser, context };
}

export async function saveSession(context: BrowserContext): Promise<void> {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
  await context.storageState({ path: STATE_PATH });
  logger.info(`Session saved to ${STATE_PATH}`);
}

export async function closeBrowser(session: BrowserSession): Promise<void> {
  await saveSession(session.context);
  await session.context.close();
  await session.browser.close();
  logger.info("Browser closed");
}
