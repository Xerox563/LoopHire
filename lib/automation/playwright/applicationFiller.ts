// lib/automation/playwright/applicationFiller.ts

import { BrowserContext, Page, Locator } from "playwright";
import { JobDetail, GeneratedMessage, AppConfig } from "@/types";
import { logger } from "../utils/logger";
import {
  navigateTo,
  fillTextarea,
  scrollPage,
  takeScreenshot,
  isLoggedIn,
} from "./pageUtils";
import { humanDelay, sleep } from "../utils/retry";

// Common selectors for YC Work at a Startup apply forms
const APPLY_SELECTORS = {
  applyButton: [
    'button:has-text("Apply")',
    'a:has-text("Apply")',
    'button:has-text("Apply to role")',
    "button.apply-button",
    '[data-test="apply-button"]',
    'button[class*="apply"]',
    'a[class*="apply"]',
  ],
  firstName: ['input[name*="first_name"]', 'input[placeholder*="First Name"]', 'input[id*="first_name"]'],
  lastName: ['input[name*="last_name"]', 'input[placeholder*="Last Name"]', 'input[id*="last_name"]'],
  email: ['input[type="email"]', 'input[name*="email"]', 'input[placeholder*="Email"]'],
  phone: ['input[type="tel"]', 'input[name*="phone"]', 'input[placeholder*="Phone"]'],
  linkedin: ['input[name*="linkedin"]', 'input[placeholder*="LinkedIn"]'],
  location: ['input[name*="location"]', 'input[placeholder*="location"]', 'input[placeholder*="City"]'],
  messageTextarea: [
    'textarea[name="message"]',
    'textarea[name="intro"]',
    'textarea[placeholder*="message"]',
    'textarea[placeholder*="introduce"]',
    'textarea[placeholder*="tell"]',
    'textarea[placeholder*="why"]',
    'textarea[placeholder*="interests you"]',
    'textarea[data-test="message"]',
    "textarea",
  ],
  submitButton: [
    'button[type="submit"]',
    'input[type="submit"]',
    'button:has-text("Submit application")',
    'button:has-text("Submit")',
    'button:has-text("Send application")',
    'button:has-text("Send")',
    '[data-test="submit-button"]',
  ],
};

async function findElement(
  page: Page,
  selectors: string[],
): Promise<Locator | null> {
  for (const sel of selectors) {
    try {
      const locator = page.locator(sel).first();
      const count = await locator.count();
      if (count > 0) {
        const visible = await locator.isVisible().catch(() => false);
        if (visible) return locator;
      }
    } catch {
      // try next selector
    }
  }
  return null;
}

async function fillField(page: Page, selectors: string[], value?: string) {
  if (!value) return;
  for (const sel of selectors) {
    try {
      const el = await page.locator(sel).first();
      if (await el.isVisible()) {
        await el.fill(value);
        return;
      }
    } catch {}
  }
}

export interface FillResult {
  action: "submitted" | "skipped" | "aborted";
  screenshotPath?: string;
  message?: string;
  subject?: string;
}

/**
 * Modified for LoopHire: Instead of terminal prompt, we might want to 
 * handle confirmation via the dashboard. For now, we'll auto-submit 
 * or handle it via the automation flow.
 */
export async function fillAndReviewApplication(
  context: BrowserContext,
  job: JobDetail,
  message: GeneratedMessage,
  delayMs: number,
  config: AppConfig,
  autoSubmit = false
): Promise<FillResult> {
  const page = await context.newPage();

  try {
    await navigateTo(page, job.url, delayMs);
    await page.waitForLoadState("networkidle").catch(() => null);

    // Check login state
    const loggedIn = await isLoggedIn(page);
    if (!loggedIn) {
       throw new Error("Not logged in. Please log in to YC Work at a Startup in the browser first.");
    }

    // Find and click apply button
    const applyBtn = await findElement(page, APPLY_SELECTORS.applyButton);
    if (!applyBtn) {
      await takeScreenshot(page, `no_apply_btn_${Date.now()}.png`);
      throw new Error(`No apply button found on: ${job.url}`);
    }

    logger.info("Clicking apply button...");
    await applyBtn.click();
    await humanDelay(delayMs, 600);
    await scrollPage(page, 300);

    // FILL PERSONAL INFO IF PROFILE EXISTS
    if (config.userProfile) {
      const p = config.userProfile;
      logger.info("Auto-filling personal information...");
      await fillField(page, APPLY_SELECTORS.firstName, p.firstName);
      await fillField(page, APPLY_SELECTORS.lastName, p.lastName);
      await fillField(page, APPLY_SELECTORS.email, p.email);
      await fillField(page, APPLY_SELECTORS.phone, p.phone);
      await fillField(page, APPLY_SELECTORS.linkedin, p.linkedinUrl);
      await fillField(page, APPLY_SELECTORS.location, p.currentLocation);
    }

    // Find message textarea
    let textareaSelector: string | null = null;
    for (const sel of APPLY_SELECTORS.messageTextarea) {
      const el = await page.$(sel);
      if (el) {
        textareaSelector = sel;
        break;
      }
    }

    if (!textareaSelector) {
      await takeScreenshot(page, `no_textarea_${Date.now()}.png`);
      throw new Error("Could not find message textarea on application form");
    }

    // Fill the textarea with generated message
    await fillTextarea(page, textareaSelector, message.body, delayMs);
    await scrollPage(page, 200);

    // Take screenshot for review
    const screenshotPath = `logs/review_${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });

    logger.info(`📋 APPLICATION READY FOR REVIEW: ${job.company}`);
    logger.info(`Subject: ${message.subject}`);
    logger.info(`Body: ${message.body}`);

    // ASK FOR CONFIRMATION
    const confirmed = await logger.prompt(`Submit application for ${job.company}?`);
    
    if (!confirmed) {
      logger.warn(`Application for ${job.company} was skipped by user.`);
      return { action: "skipped", message: message.body, subject: message.subject };
    }

    // Find and click submit button
    const submitBtn = await findElement(page, APPLY_SELECTORS.submitButton);
    if (!submitBtn) {
      throw new Error("Submit button not found");
    }

    logger.info("Submitting application...");
    await submitBtn.click();
    await humanDelay(delayMs * 2, 800);

    // Wait for success indicator
    await sleep(3000);
    const finalScreenshot = `logs/submitted_${Date.now()}.png`;
    await page.screenshot({ path: finalScreenshot, fullPage: false });
    logger.info(`Application submitted! Screenshot: ${finalScreenshot}`);

    return { 
      action: "submitted", 
      screenshotPath: finalScreenshot,
      message: message.body,
      subject: message.subject
    };
  } finally {
    await page.close();
  }
}
