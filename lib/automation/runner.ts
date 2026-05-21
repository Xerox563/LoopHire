// lib/automation/runner.ts

import { AppConfig, JobRecord, RunResult } from "@/types";
import { logger } from "./utils/logger";
import { withRetry, humanDelay } from "./utils/retry";
import { createOpenRouterClient, generateOutreachMessage } from "./ai/openrouter";
import { launchBrowser, closeBrowser, saveSession } from "./playwright/browser";
import { scrapeJobDetail } from "./playwright/jobScraper";
import { fillAndReviewApplication } from "./playwright/applicationFiller";
import { supabase } from "@/lib/supabase";

export async function runJobApplications(
  config: AppConfig, 
  jobs: JobRecord[],
  resume: string
): Promise<RunResult[]> {
  const results: RunResult[] = [];
  const aiClient = createOpenRouterClient(config);

  const pending = jobs.filter(j => j.status === "pending");

  if (pending.length === 0) {
    logger.info("No pending jobs found to process");
    return results;
  }

  logger.info(`Found ${pending.length} pending job(s) to process`);

  const session = await launchBrowser(config.headless);

  try {
    for (const job of pending) {
      logger.info(`\nProcessing job: ${job.id} — ${job.url}`);
      
      // Update status to 'reviewing' immediately to show progress in UI
      await supabase
        .from("jobs")
        .update({ status: "reviewing" })
        .eq("id", job.id);

      const result = await processJob(job, resume, config, aiClient, session.context);
      results.push(result);

      // Sync result to Supabase
      const { error: dbError } = await supabase
        .from("jobs")
        .update({
          status: result.status,
          applied_at: result.status === "applied" ? new Date().toISOString() : null,
          failure_reason: result.error || null,
          outreach_message: (result as any).outreachMessage || null,
          outreach_subject: (result as any).outreachSubject || null,
        })
        .eq("id", job.id);

      if (dbError) {
        logger.error(`Failed to update job ${job.id} in Supabase: ${dbError.message}`);
      } else {
        logger.info(`Job ${job.id} status synced to Supabase.`);
      }

      // Save browser session after each job
      await saveSession(session.context);

      // Human-like delay between jobs
      if (pending.indexOf(job) < pending.length - 1) {
        const waitMs = 5000 + Math.random() * 5000;
        logger.info(`Waiting ${Math.round(waitMs / 1000)}s before next job...`);
        await humanDelay(waitMs);
      }
    }
  } finally {
    await closeBrowser(session);
  }

  const applied = results.filter((r) => r.status === "applied").length;
  const failed = results.filter((r) => r.status === "failed").length;
  const skipped = results.filter((r) => r.status === "skipped").length;

  logger.info(
    `\nRun complete. Applied: ${applied} | Skipped: ${skipped} | Failed: ${failed}`
  );

  return results;
}

async function processJob(
  job: JobRecord,
  resume: string,
  config: AppConfig,
  aiClient: ReturnType<typeof createOpenRouterClient>,
  context: import("playwright").BrowserContext
): Promise<RunResult> {
  try {
    // Step 0: Validate URL
    if (!job.url || !job.url.startsWith("http")) {
      logger.error(`Invalid URL for job ${job.id}: ${job.url}`);
      return {
        jobId: job.id,
        success: false,
        status: "invalid",
        error: "Invalid job link provided",
      };
    }

    // Step 1: Scrape job details
    let jobDetail;
    try {
      jobDetail = await withRetry(
        () => scrapeJobDetail(context, job, config.actionDelayMs),
        {
          maxAttempts: config.maxRetries,
          delayMs: 2000,
          onRetry: (n, err) => logger.warn(`Scrape retry ${n}: ${err.message}`),
          // Don't retry if it's a 404/dead link
          shouldRetry: (err: Error) => !err.message?.includes('404') && !err.message?.includes('not found') && !err.message?.includes('no longer available')
        }
      );
    } catch (err: any) {
      // If navigation failed (e.g. 404, DNS), mark as invalid info
      if (err.message?.includes('net::') || err.message?.includes('404') || err.message?.includes('Navigation failed')) {
        logger.error(`Dead link detected for job ${job.id}: ${err.message}`);
        return {
          jobId: job.id,
          success: false,
          status: "invalid",
          error: "Link is unreachable or invalid",
        };
      }
      throw err; // Re-throw other errors for general failure handling
    }

    await humanDelay(config.actionDelayMs);

    // Step 2: Use existing outreach message or generate one
    let message: any;
    if (job.outreachMessage && job.outreachMessage.trim().length > 0) {
      logger.info(`Using your custom outreach message for ${jobDetail.company}`);
      message = {
        subject: job.outreachSubject || `Application for ${jobDetail.role} at ${jobDetail.company}`,
        body: job.outreachMessage
      };
    } else {
      logger.info(`Generating AI message for ${jobDetail.company}`);
      message = await generateOutreachMessage(
        aiClient,
        jobDetail,
        resume,
        config.openRouterModel,
        config.maxRetries
      );
    }

    logger.info(`Subject: "${message.subject}"`);
    await humanDelay(config.actionDelayMs);

    // Step 3: Fill and review application
    const fillResult = await fillAndReviewApplication(
      context,
      job.id,
      jobDetail,
      message,
      config.actionDelayMs,
      config,
      true // autoSubmit for now in LoopHire
    );

    if (fillResult.action === "submitted") {
      return {
        jobId: job.id,
        success: true,
        status: "applied",
        message: `${jobDetail.company}|${jobDetail.role}`,
        outreachMessage: fillResult.message,
        outreachSubject: fillResult.subject,
      } as any;
    }

    if (fillResult.action === "skipped") {
      return {
        jobId: job.id,
        success: true,
        status: "skipped",
        message: "User chose to skip",
      };
    }

    return {
      jobId: job.id,
      success: false,
      status: "pending",
      message: "User aborted",
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    logger.error(`Job ${job.id} failed: ${error}`);
    return {
      jobId: job.id,
      success: false,
      status: "failed",
      error,
    };
  }
}
