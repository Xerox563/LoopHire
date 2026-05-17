import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
      };

      try {
        // Path to the automation engine
        const automationPath = path.resolve(process.cwd(), "../yc-apply");
        
        send({ type: "log", message: "Starting automation engine...", level: "system" });
        send({ type: "progress", value: 5 });

        // In a real production app, we would use a proper job queue (like BullMQ)
        // For this demo/internal tool, we'll spawn the process directly
        const child = spawn("npm", ["run", "dev"], {
          cwd: automationPath,
          env: { ...process.env, FORCE_COLOR: "1" },
        });

        child.stdout.on("data", (data) => {
          const output = data.toString().trim();
          if (output) {
            // Basic parsing of the output to provide better UI feedback
            let level: "info" | "warn" | "error" = "info";
            if (output.toLowerCase().includes("error")) level = "error";
            if (output.toLowerCase().includes("warn")) level = "warn";
            
            send({ type: "log", message: output, level });
            
            // Try to infer progress from the logs
            if (output.includes("Processing job")) send({ type: "progress", value: 30 });
            if (output.includes("Generating AI message")) send({ type: "progress", value: 60 });
            if (output.includes("Browser session saved")) send({ type: "progress", value: 90 });
          }
        });

        child.stderr.on("data", (data) => {
          send({ type: "log", message: data.toString(), level: "error" });
        });

        child.on("close", (code) => {
          if (code === 0) {
            send({ type: "progress", value: 100 });
            send({ type: "done" });
          } else {
            send({ type: "error", message: `Process exited with code ${code}` });
          }
          controller.close();
        });

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
