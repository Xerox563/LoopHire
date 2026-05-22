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

  // Use 'chrome' channel to use the system's Google Chrome instead of Chromium
  const browser = await chromium.launch({
    headless,
    channel: "chrome",
    args: [
      "--no-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-dev-shm-usage",
    ],
  });

  const contextOptions: Parameters<Browser["newContext"]>[0] = {
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    viewport: { 
      width: 1280 + Math.floor(Math.random() * 200), 
      height: 720 + Math.floor(Math.random() * 200) 
    },
    deviceScaleFactor: 1,
    hasTouch: false,
    locale: "en-US",
    timezoneId: "America/New_York",
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
      'Sec-Fetch-Dest': 'document',
      'Referer': 'https://www.wellfound.com/',
      'Upgrade-Insecure-Requests': '1',
    }
  };

  // Load persisted session state if it exists
  if (fs.existsSync(STATE_PATH)) {
    logger.info("Loading persisted browser session from state.json");
    contextOptions.storageState = STATE_PATH;
  } else {
    logger.info("No saved session found — starting fresh");
  }

  const context = await browser.newContext(contextOptions);

  // --- STEALTH & ANTI-DETECTION LAYER ---
  await context.addInitScript(() => {
    // 1. Hide Webdriver
    const nav = (globalThis as any).navigator;
    if (nav) {
      Object.defineProperty(nav, "webdriver", { get: () => undefined });
    }

    // 2. Mock Plugins and Hardware
    (globalThis as any).navigator.chrome = { runtime: {} };
    Object.defineProperty(nav, 'languages', { get: () => ['en-US', 'en'] });
    Object.defineProperty(nav, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    
    // 3. Mock WebGL vendor
    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
      if (parameter === 37445) return 'Intel Inc.';
      if (parameter === 37446) return 'Intel(R) Iris(TM) Graphics 6100';
      return getParameter.apply(this, [parameter]);
    };

    // 4. Mock permissions
    const originalQuery = (globalThis as any).navigator.permissions.query;
    (globalThis as any).navigator.permissions.query = (parameters: any) => (
      parameters.name === 'notifications' ?
        Promise.resolve({ state: Notification.permission }) :
        originalQuery(parameters)
    );
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
