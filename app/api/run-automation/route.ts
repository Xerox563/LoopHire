import { NextRequest, NextResponse } from "next/server";
import { runJobApplications } from "@/lib/automation/runner";
import { setLogger } from "@/lib/automation/utils/logger";
import { AppConfig, JobRecord } from "@/types";

export async function POST(req: NextRequest) {
  const { jobs, resumeData } = await req.json();
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
      };

      // Set up a custom logger that pipes to the stream
      setLogger({
        info: (msg) => send({ type: "log", message: msg, level: "info" }),
        warn: (msg) => send({ type: "log", message: msg, level: "warn" }),
        error: (msg) => send({ type: "log", message: msg, level: "error" }),
        prompt: async (msg) => {
          send({ type: "prompt", message: msg });
          
          // Wait for a few seconds to let the user see the message in the browser
          // and decide if they want to let it proceed. 
          // Since we can't do a real two-way confirm in a simple stream easily,
          // we'll implement a "pause" by waiting.
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          return true;
        }
      });

      try {
        send({ type: "log", message: "Starting unified automation engine...", level: "system" });
        send({ type: "progress", value: 5 });

        const config: AppConfig = {
          openRouterApiKey: process.env.OPENROUTER_API_KEY || "",
          openRouterModel: process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat",
          headless: process.env.HEADLESS === "true",
          actionDelayMs: parseInt(process.env.ACTION_DELAY_MS || "1200", 10),
          maxRetries: parseInt(process.env.MAX_RETRIES || "3", 10),
        };

        const resumeText = `EXPERIENCE:\n${resumeData.experience}\n\nTECHNICAL SKILLS:\n${resumeData.technicalSkills}\n\nEDUCATION:\n${resumeData.education}\n\nPROJECTS:\n${resumeData.projects}`;

        // Run the automation locally within the Next.js process
        const results = await runJobApplications(config, jobs as JobRecord[], resumeText);

        send({ type: "progress", value: 100 });
        send({ type: "done", results });
        controller.close();

      } catch (error) {
        send({ type: "error", message: error instanceof Error ? error.message : String(error) });
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
