"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { JobRecord } from "@/types";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "warn" | "error" | "system";
  message: string;
}

interface AutomationContextType {
  isRunning: boolean;
  logs: LogEntry[];
  progress: number;
  startAutomation: (jobs: JobRecord[], resumeData: any) => Promise<void>;
  stopAutomation: () => void;
  addLog: (message: string, type?: LogEntry["type"]) => void;
}

const AutomationContext = createContext<AutomationContextType | undefined>(undefined);

export function AutomationProvider({ children }: { children: React.ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const addLog = useCallback((message: string, type: LogEntry["type"] = "info") => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setLogs((prev) => [...prev, newLog]);
  }, []);

  const stopAutomation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsRunning(false);
    addLog("Automation engine manually terminated.", "warn");
  }, [addLog]);

  const startAutomation = useCallback(async (jobs: JobRecord[], resumeData: any) => {
    if (isRunning) return;
    
    setIsRunning(true);
    setLogs([]);
    setProgress(0);
    abortControllerRef.current = new AbortController();

    addLog("Initializing LoopHire OS Automation Core...", "system");

    try {
      const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "";
      const apiEndpoint = workerUrl ? `${workerUrl}/run-automation` : "/api/run-automation";
      
      addLog(`Connecting to remote engine at ${apiEndpoint}...`, "info");

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: JSON.stringify({ jobs, resumeData }),
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
      });

      if (!response.body) throw new Error("No response body from engine");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.type === "log") {
              addLog(data.message, data.level || "info");
            } else if (data.type === "progress") {
              setProgress(data.value);
            } else if (data.type === "done") {
              addLog("Automation pipeline completed successfully.", "system");
              setIsRunning(false);
            } else if (data.type === "error") {
              addLog(data.message, "error");
              setIsRunning(false);
            }
          } catch (e) {
            // Raw log fallback
            addLog(line, "info");
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }
      
      let errorMessage = error.message || String(error);
      if (errorMessage === "Failed to fetch" || error.name === "TypeError") {
        errorMessage = "Connection Failed: Engine unreachable. If using Brave, disable shields.";
      }
      
      addLog(`Critical Error: ${errorMessage}`, "error");
      setIsRunning(false);
    }
  }, [isRunning, addLog]);

  return (
    <AutomationContext.Provider value={{ isRunning, logs, progress, startAutomation, stopAutomation, addLog }}>
      {children}
    </AutomationContext.Provider>
  );
}

export function useAutomation() {
  const context = useContext(AutomationContext);
  if (context === undefined) {
    throw new Error("useAutomation must be used within an AutomationProvider");
  }
  return context;
}
