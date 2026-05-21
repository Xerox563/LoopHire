// lib/automation/playwright/jobScraper.ts

import { BrowserContext, Page } from "playwright";
import { JobDetail, JobRecord } from "@/types";
import { logger } from "../utils/logger";
import {
  navigateTo,
  extractText,
  extractMultiText,
  scrollPage,
  takeScreenshot,
} from "./pageUtils";

// Selectors for YC Work at a Startup job pages
const SELECTORS = {
  jobTitle: [
    "h1",
    ".job-title",
    '[data-test="job-title"]',
    ".role-title",
    'h2[class*="JobTitle"]',
    'h1[class*="JobTitle"]',
  ],
  companyName: [
    ".company-name",
    '[data-test="company-name"]',
    "h2.company",
    ".startup-name",
    "a.company-name",
    'h2[class*="CompanyName"]',
    'span[class*="CompanyName"]',
  ],
  jobDescription: [
    ".job-description",
    '[data-test="job-description"]',
    ".description",
    ".role-description",
    "section.description",
    "article",
    'div[class*="JobDescription"]',
    'div[class*="description"]',
  ],
};

async function trySelectors(
  page: Page,
  selectors: string[]
): Promise<string> {
  for (const sel of selectors) {
    const text = await extractText(page, sel);
    if (text.trim().length > 2) return text.trim();
  }
  return "";
}

export async function scrapeJobDetail(
  context: BrowserContext,
  job: JobRecord,
  delayMs: number
): Promise<JobDetail> {
  const page = await context.newPage();

  try {
    await navigateTo(page, job.url, delayMs);
    await scrollPage(page, 400);

    // Extract job title
    let role = job.role;
    if (!role) {
      role = await trySelectors(page, SELECTORS.jobTitle);
    }

    // Extract company name
    let company = job.company;
    if (!company) {
      company = await trySelectors(page, SELECTORS.companyName);
    }

    // Extract description — try specific selectors first, then body fallback
    let description = await trySelectors(page, SELECTORS.jobDescription);

    if (!description || description.length < 100) {
      // Fallback: grab all visible text from main content area
      description = await extractMultiText(page, ["main", "body"]);
      description = description.slice(0, 5000);
    }

    if (!description || description.length < 50) {
      await takeScreenshot(page, `debug_${job.id}.png`);
      throw new Error(
        `Could not extract job description from ${job.url}. ` +
          `A debug screenshot has been saved.`
      );
    }

    logger.info(
      `Scraped job: "${role}" at "${company}" (${description.length} chars)`
    );

    return {
      company: company || "Unknown Company",
      role: role || "Unknown Role",
      description,
      url: job.url,
    };
  } finally {
    await page.close();
  }
}
