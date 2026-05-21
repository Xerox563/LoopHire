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
  selectOption,
  uploadFile,
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
    'a:has-text("Interested")',
    'button:has-text("Interested")',
    'a:has-text("Connect to apply")',
    'button:has-text("Connect to apply")',
    'a:has-text("Quick Apply")',
    'button:has-text("Quick Apply")',
    "button.apply-button",
    "a.apply-button",
    '[data-test="apply-button"]',
    'button[class*="apply"]',
    'a[class*="apply"]',
    'button[class*="Apply"]',
    'a[class*="Apply"]',
    'button[id*="apply"]',
    'a[id*="apply"]',
  ],
  firstName: ['input[name*="first_name"]', 'input[placeholder*="First Name"]', 'input[id*="first_name"]'],
  lastName: ['input[name*="last_name"]', 'input[placeholder*="Last Name"]', 'input[id*="last_name"]'],
  email: ['input[type="email"]', 'input[name*="email"]', 'input[placeholder*="Email"]'],
  phone: ['input[type="tel"]', 'input[name*="phone"]', 'input[placeholder*="Phone"]'],
  linkedin: ['input[name*="linkedin"]', 'input[placeholder*="LinkedIn"]'],
  location: ['input[name*="location"]', 'input[placeholder*="location"]', 'input[placeholder*="City"]'],
  wellfound: {
    salary: ['input[name*="salary"]', 'select[name*="salary"]', 'input[placeholder*="salary"]'],
    experience: ['input[name*="experience"]', 'select[name*="experience"]', 'input[placeholder*="experience"]'],
    workAuth: ['input[name*="work_authorization"]', 'select[name*="work_authorization"]'],
    sponsorship: ['input[name*="sponsorship"]', 'select[name*="sponsorship"]'],
    resume: ['input[type="file"][name*="resume"]', 'input[type="file"][id*="resume"]', 'input[type="file"]'],
  },
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
    'button:has-text("Submit application")',
    'button:has-text("Send application")',
    'button:has-text("Confirm interest")',
    'button:has-text("Apply now")',
    'button:has-text("Submit")',
    'button:has-text("Confirm")',
    'button:has-text("Send")',
    'button[type="submit"]',
    'input[type="submit"]',
    '[data-test="submit-button"]',
    'button[class*="submit"]',
    'button[class*="Submit"]',
    'button[id*="submit"]',
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
       const platform = job.url.includes("wellfound.com") ? "Wellfound" : "the platform";
       throw new Error(`Not logged in. Please log in to ${platform} in the browser first.`);
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

      // Wellfound specific fields
      if (job.url.includes("wellfound.com") || job.url.includes("angel.co")) {
        logger.info("Filling Wellfound-specific fields...");
        await fillField(page, APPLY_SELECTORS.wellfound.salary, p.desiredSalary);
        await fillField(page, APPLY_SELECTORS.wellfound.experience, p.yearsOfExperience);
        
        // Handle dropdowns for Work Auth and Sponsorship
        if (p.usWorkAuthorization) {
          await selectOption(page, APPLY_SELECTORS.wellfound.workAuth, p.usWorkAuthorization);
        }
        if (p.requiresSponsorship) {
          await selectOption(page, APPLY_SELECTORS.wellfound.sponsorship, p.requiresSponsorship);
        }

        if (p.resumeFilePath) {
          logger.info("Uploading resume...");
          await uploadFile(page, APPLY_SELECTORS.wellfound.resume, p.resumeFilePath);
        }
      }
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

    if (!autoSubmit) {
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
    } else {
      logger.info(`Auto-submitting application for ${job.company}...`);
    }

    const initialUrl = page.url();
    // --- UNIVERSAL WEAPON: ENTER KEY SUBMISSION ---
    logger.info("Submitting application via Universal Weapon (Enter Key)...");
    await page.keyboard.press("Enter");
    await sleep(2000);
    
    // Fallback: Primary button click
    const fallbackSubmitBtn = await findElement(page, APPLY_SELECTORS.submitButton);
    if (fallbackSubmitBtn) {
      const stillVisible = await fallbackSubmitBtn.isVisible().catch(() => false);
      if (stillVisible) {
        logger.info("Enter key didn't close form, attempting Force Click...");
        await fallbackSubmitBtn.click({ force: true });
      }
    }
    
    // Wait for submission to complete and verify
    logger.info("Verifying submission...");
    let submitted = false;
    let errorDetected = false;
    let errorMessage = "";
    const startTime = Date.now();
    
    // Check for success or error indicators for up to 15 seconds
    while (Date.now() - startTime < 15000) {
      const currentUrl = page.url();
      const pageContent = await page.textContent('body').then(t => t?.toLowerCase() || "");
      
      // --- ALERT HANDLING ---
      // Check for browser alerts (like YC application limits)
      page.on('dialog', async dialog => {
        const msg = dialog.message().toLowerCase();
        if (msg.includes("limit") || msg.includes("reached")) {
          errorDetected = true;
          errorMessage = `Platform Limit Reached: ${dialog.message()}`;
        }
        await dialog.dismiss();
      });

      // Also check for alert-like text in the page content
      if (pageContent.includes("reached your limit") || pageContent.includes("applications per week")) {
        errorDetected = true;
        errorMessage = "Platform Limit Reached: You've reached your application limit for this week.";
        break;
      }
      if (currentUrl !== initialUrl && !currentUrl.includes("apply") && !currentUrl.includes("job")) {
        logger.info(`URL changed from ${initialUrl} to ${currentUrl}, assuming success.`);
        submitted = true;
        break;
      }

    // 1. Check for explicit error messages
    const errorIndicators = [
      "is required",
      "cannot be blank",
      "please fix",
      "invalid email",
      "error occurred",
      "try again",
      "must be",
      "missing information",
      "already applied",
      "invalid format",
      "check the form",
      "error submitting",
      "reached your limit",
      "applications per week",
    ];

      if (errorIndicators.some(indicator => pageContent.includes(indicator))) {
        errorDetected = true;
        errorMessage = `Form error detected: ${errorIndicators.find(i => pageContent.includes(i))}`;
        break;
      }

      // 2. Check for success indicators - make them more specific
      const successIndicators = [
        "application sent", 
        "thank you", 
        "success!", 
        "successfully submitted",
        "we've received your application",
        "your application was sent",
        "application submitted",
        "go to my applications",
        "view your applications",
      ];
      
      if (successIndicators.some(indicator => pageContent.includes(indicator))) {
        logger.info(`Found success indicator: ${successIndicators.find(i => pageContent.includes(i))}`);
        submitted = true;
        break;
      }
      
      // 3. Check if the modal/form is gone
      // We check for the textarea or the submit button
      const textareaStillVisible = await page.locator('textarea').first().isVisible().catch(() => false);
      const submitBtnStillVisible = fallbackSubmitBtn ? await fallbackSubmitBtn.isVisible().catch(() => false) : false;

      if (!textareaStillVisible && !submitBtnStillVisible) {
        // Form seems gone. Wait a bit more to see if an error pops up
        await sleep(2000);
        const finalContent = await page.textContent('body').then(t => t?.toLowerCase() || "");
        if (!errorIndicators.some(indicator => finalContent.includes(indicator))) {
          logger.info("Form and button are gone and no error detected, assuming success.");
          submitted = true;
          break;
        }
      }
      
      // 4. Specifically for Work at a Startup (YC): Check if the 'Apply' button text changed to 'Applied'
       const verifyApplyBtn = await findElement(page, APPLY_SELECTORS.applyButton);
       if (verifyApplyBtn) {
         const applyBtnText = await verifyApplyBtn.textContent().then(t => t?.toLowerCase() || "");
         if (applyBtnText.includes("applied") || applyBtnText.includes("view application")) {
           logger.info("Apply button text changed to 'Applied', submission confirmed.");
           submitted = true;
           break;
         }
       }
    
    await sleep(2000);
    }

    if (errorDetected) {
      await takeScreenshot(page, `submission_error_${Date.now()}.png`);
      throw new Error(errorMessage);
    }

    if (!submitted) {
      await takeScreenshot(page, `unverified_submission_${Date.now()}.png`);
      throw new Error("Could not verify submission success after 15 seconds.");
    }

    await humanDelay(delayMs * 2, 800);
    const finalScreenshot = `logs/submitted_${Date.now()}.png`;
    await page.screenshot({ path: finalScreenshot, fullPage: false });
    logger.info(`Application process finished successfully. Screenshot: ${finalScreenshot}`);

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
