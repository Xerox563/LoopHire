// lib/automation/ai/openrouter.ts

import OpenAI from "openai";
import { AppConfig, GeneratedMessage, JobDetail } from "@/types";
import { logger } from "../utils/logger";
import { withRetry } from "../utils/retry";

export function createOpenRouterClient(config: AppConfig): OpenAI {
  return new OpenAI({
    apiKey: config.openRouterApiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://loophire.os",
      "X-Title": "LoopHire OS",
    },
  });
}

const SYSTEM_PROMPT = `You are writing a brief intro message for a job application.

Rules:
- 80-100 words MAX for the body. Be concise.
- Sound human, not like a cover letter.
- 2-3 short paragraphs: hook → 1 relevant achievement → why you are interested in this specific role/company → ask.
- Reference one specific thing from the job description to show genuine interest.
- No buzzwords, no fluff, no "I am passionate about".
- End with a simple question like "Open to a quick chat?"

Respond ONLY with valid JSON:
{
  "subject": "string (max 60 chars)",
  "body": "string (80-100 words)"
}`;

export async function generateOutreachMessage(
  client: OpenAI,
  job: JobDetail,
  resume: string,
  model: string,
  maxRetries: number,
): Promise<GeneratedMessage> {
  const userPrompt = `
JOB LISTING:
Company: ${job.company}
Role: ${job.role}
URL: ${job.url}

Job Description:
${job.description.slice(0, 3000)}

---
CANDIDATE RESUME:
${resume.slice(0, 3000)}

---
Write a personalized application message for this role.
`;

  logger.info(
    `Generating outreach message via OpenRouter (model: ${model})...`,
  );

  const rawText = await withRetry(
    async () => {
      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 600,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response from OpenRouter API");
      }
      return content;
    },
    {
      maxAttempts: maxRetries,
      delayMs: 2000,
      onRetry: (attempt, err) =>
        logger.warn(`OpenRouter retry ${attempt}: ${err.message}`),
    },
  );

  return parseGeneratedMessage(rawText);
}

function parseGeneratedMessage(raw: string): GeneratedMessage {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Failed to parse AI response as JSON. Raw response:\n${raw.slice(0, 300)}`,
    );
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as Record<string, unknown>).subject !== "string" ||
    typeof (parsed as Record<string, unknown>).body !== "string"
  ) {
    throw new Error(
      `AI response missing required fields. Got: ${JSON.stringify(parsed).slice(0, 200)}`,
    );
  }

  const msg = parsed as GeneratedMessage;
  if (msg.subject.length > 60) {
    msg.subject = msg.subject.slice(0, 60);
  }

  return msg;
}
