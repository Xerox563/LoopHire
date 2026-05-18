// lib/automation/playwright/applicationFiller.ts

import { BrowserContext, Page, Locator } from "playwright";
import { JobDetail, GeneratedMessage, AppConfig, JobRecord } from "@/types";
import { logger } from "../utils/logger";
import {
  navigateTo,
  fillTextarea,
  scrollPage,
  takeScreenshot,
  isLoggedIn,
} from "./pageUtils";
import { humanDelay, sleep } from "../utils/retry";
import { supabase } from "@/lib/supabase";

// Common selectors for YC Work at a Startup apply forms
const APPLY_SELECTORS = {
  applyButton: [
    'a:has-text("Apply to role")',
    'button:has-text("Apply to role")',
    'a:has-text("Apply")',
    'button:has-text("Apply")',
    'a:has-text("Apply Now")',
    'button:has-text("Apply Now")',
    "button.apply-button",
    "a.apply-button",
    '[data-test="apply-button"]',
    'button[class*="apply"]',
    'a[class*="apply"]',
    'button[class*="Apply"]',
    'a[class*="Apply"]',
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
    'textarea[name*="interest"]',
    'textarea[id*="interest"]',
    'textarea[id*="message"]',
    'textarea[id*="note"]',
    'textarea[placeholder*="message"]',
    'textarea[placeholder*="introduce"]',
    'textarea[placeholder*="tell"]',
    'textarea[placeholder*="why"]',
    'textarea[placeholder*="interests you"]',
    'textarea[placeholder*="about you"]',
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

async function findElement(page: Page, selectors: string[]): Promise<Locator | null> {
  for (const sel of selectors) {
    try {
      const locator = page.locator(sel).first();
      if ((await locator.count()) > 0 && (await locator.isVisible().catch(() => false))) {
        return locator;
      }
    } catch {}
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

/** Review step before submission */
export async function fillAndReviewApplication(
  context: BrowserContext,
  jobId: string,
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

    if (!(await isLoggedIn(page))) {
       throw new Error("Not logged in. Please log in to YC in the browser first.");
    }

    await scrollPage(page, 500);
    await sleep(1000);

    const applyBtn = await findElement(page, APPLY_SELECTORS.applyButton);
    if (!applyBtn) {
      await takeScreenshot(page, `no_apply_btn_${Date.now()}.png`);
      throw new Error(`No apply button found on: ${job.url}`);
    }

    logger.info("Clicking apply button...");
    await applyBtn.click();
    
    // Wait for form to appear
    await page.waitForSelector("textarea", { timeout: 15000 }).catch(() => null);
    await humanDelay(delayMs, 1000);
    await scrollPage(page, 300);

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

    let textareaSelector: string | null = null;
    for (const sel of APPLY_SELECTORS.messageTextarea) {
      const locator = page.locator(sel).first();
      if (await locator.isVisible().catch(() => false)) {
        textareaSelector = sel;
        break;
      }
    }

    if (!textareaSelector) {
      await takeScreenshot(page, `no_textarea_${Date.now()}.png`);
      throw new Error("Could not find message textarea");
    }

    await fillTextarea(page, textareaSelector, message.body, delayMs);
    await scrollPage(page, 200);

    const screenshotPath = `logs/review_${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });

    logger.info(`📋 APPLICATION READY FOR REVIEW: ${job.company}`);
    logger.info(`Subject: ${message.subject}`);
    logger.info(`Body: ${message.body}`);

    await supabase
      .from("jobs")
      .update({ 
        status: "reviewing", 
        outreach_message: message.body,
        outreach_subject: message.subject 
      })
      .eq("id", jobId);

    logger.warn(`Waiting for confirmation in the dashboard...`);

    let userAction: "confirmed" | "skipped" | null = null;
    const timeoutAt = Date.now() + 10 * 60 * 1000;

    while (Date.now() < timeoutAt) {
      const { data } = await supabase.from("jobs").select("status").eq("id", jobId).single();
      if (data?.status === "confirmed") { userAction = "confirmed"; break; }
      if (data?.status === "skipped") { userAction = "skipped"; break; }
      await sleep(2000);
    }

    if (!userAction || userAction === "skipped") {
      const reason = userAction === "skipped" ? "skipped by user" : "timed out";
      logger.warn(`Application for ${job.company} was ${reason}.`);
      return { action: "skipped", message: message.body, subject: message.subject };
    }

    logger.info(`Confirmation received! Submitting to ${job.company}...`);

    const submitBtn = await findElement(page, APPLY_SELECTORS.submitButton);
    if (!submitBtn) throw new Error("Submit button not found");

    logger.info("Submitting application...");
    await submitBtn.click();
    await humanDelay(delayMs * 2, 800);

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
