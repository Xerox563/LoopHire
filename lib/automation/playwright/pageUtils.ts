// lib/automation/playwright/pageUtils.ts

import { Page } from "playwright";
import { humanDelay, sleep } from "../utils/retry";
import { logger } from "../utils/logger";

/**
 * Navigate to a URL and wait for the page to be stable.
 */
export async function navigateTo(
  page: Page,
  url: string,
  delayMs: number,
): Promise<void> {
  logger.info(`Navigating to: ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await humanDelay(delayMs);
}

/**
 * Wait for a selector to appear, with a friendly timeout error.
 */
export async function waitForSelector(
  page: Page,
  selector: string,
  timeout = 15_000,
): Promise<void> {
  await page.waitForSelector(selector, { timeout }).catch(() => {
    throw new Error(`Selector not found within ${timeout}ms: "${selector}"`);
  });
}

/**
 * Type text into a field with human-like character delays.
 */
export async function typeSlowly(
  page: Page,
  selector: string,
  text: string,
  delayBetweenCharsMs = 40,
): Promise<void> {
  await page.click(selector);
  await sleep(200);
  await page.type(selector, text, { delay: delayBetweenCharsMs });
}

/**
 * Fill a textarea instantly using Playwright's fill().
 */
export async function fillTextarea(
  page: Page,
  selector: string,
  text: string,
  delayMs: number,
): Promise<void> {
  logger.info(`Filling textarea: ${selector}`);
  await page.locator(selector).first().fill(text);
  await humanDelay(delayMs);
}

/**
 * Scroll the page slowly to simulate human reading.
 */
export async function scrollPage(page: Page, pixels = 600): Promise<void> {
  await page.evaluate((px) => {
    (globalThis as any).scrollBy({ top: px, behavior: "smooth" });
  }, pixels);
  await sleep(800);
}

/**
 * Extract text content from an element, returning empty string if not found.
 */
export async function extractText(
  page: Page,
  selector: string,
): Promise<string> {
  try {
    return (await page.textContent(selector, { timeout: 5_000 })) ?? "";
  } catch {
    return "";
  }
}

/**
 * Extract inner text from multiple elements, joined by newline.
 */
export async function extractMultiText(
  page: Page,
  selectors: string[],
): Promise<string> {
  const parts: string[] = [];
  for (const sel of selectors) {
    const text = await extractText(page, sel);
    if (text.trim()) parts.push(text.trim());
  }
  return parts.join("\n\n");
}

/**
 * Take a screenshot for debugging.
 */
export async function takeScreenshot(
  page: Page,
  filename: string,
): Promise<void> {
  const p = `logs/${filename}`;
  await page.screenshot({ path: p, fullPage: false });
  logger.info(`Screenshot saved: ${p}`);
}

/**
 * Check if we are currently logged into YC.
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    const indicators = [
      'a[href="/profile"]',
      'button:has-text("Amit")',
      ".user-dropdown",
      'a[href*="/profile"]',
      'text="My profile"',
    ];
    for (const sel of indicators) {
      const el = await page.$(sel);
      if (el) return true;
    }
    const signIn = await page.$(
      'a[href*="sign_in"], a:has-text("Sign in"), button:has-text("Sign in")',
    );
    return signIn === null;
  } catch {
    return true;
  }
}
