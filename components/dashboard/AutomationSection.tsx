"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, Terminal as TerminalIcon, Cpu, AlertCircle, CheckCircle2, Loader2, Save, Send, XCircle } from "lucide-react";
import { JobRecord } from "@/types";
import { ResumeData } from "./ResumeSection";
import { supabase } from "@/lib/supabase";

interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "warn" | "error" | "system";
  message: string;
}

interface AutomationSectionProps {
  jobs: JobRecord[];
  resumeData?: ResumeData;
}

export default function AutomationSection({ jobs, resumeData }: AutomationSectionProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Filter jobs to find if any are currently 'reviewing'
  const reviewingJob = jobs.find(j => j.status === "reviewing");

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const startAutomation = async () => {
    if (!resumeData) {
      addLog("Cannot start: No resume profile found. Please upload and parse your resume first.", "error");
      return;
    }

    setIsRunning(true);
    setLogs([]);
    setProgress(0);
    addLog("Initializing LoopHire OS Automation Core...", "system");
    addLog("Syncing jobs and resume profile to automation engine...", "info");

    try {
      const response = await fetch("/api/run-automation", {
        method: "POST",
        body: JSON.stringify({ jobs, resumeData }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.body) throw new Error("No response body");

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
              addLog("Automation run completed successfully.", "system");
              setIsRunning(false);
            } else if (data.type === "error") {
              addLog(data.message, "error");
              setIsRunning(false);
            }
          } catch (e) {
            // Fallback for non-JSON lines
            addLog(line, "info");
          }
        }
      }
    } catch (error) {
      addLog(`Automation failed: ${error instanceof Error ? error.message : String(error)}`, "error");
      setIsRunning(false);
    }
  };

  const stopAutomation = () => {
    // In a real implementation, this would send a signal to the API to kill the process
    addLog("Manual abort requested. Cleaning up...", "warn");
    setIsRunning(false);
  };

  const handleConfirm = async (id: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status: "confirmed" })
      .eq("id", id);
    
    if (error) {
      console.error("Supabase error:", error);
      addLog(`Error confirming: ${error.message}`, "error");
    } else {
      addLog("Application confirmed. Proceeding with submission...", "system");
    }
  };

  const handleSkipReview = async (id: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status: "skipped" })
      .eq("id", id);
    
    if (error) {
      console.error("Supabase error:", error);
      addLog(`Error skipping: ${error.message}`, "error");
    } else {
      addLog("Application skipped by user.", "warn");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Control Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-accent" />
              Engine Control
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Status</span>
                <span className={`font-bold uppercase tracking-widest ${isRunning ? "text-success animate-pulse" : "text-text-secondary"}`}>
                  {isRunning ? "Active" : "Idle"}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-accent"
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-text-muted">
                <span>Task Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {reviewingJob && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 rounded-xl bg-accent/10 border border-accent/20 space-y-4 mb-3"
                  >
                    <div className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-2">
                      <AlertCircle className="w-3 h-3" />
                      Review Required
                    </div>
                    <p className="text-[10px] text-text-secondary leading-relaxed">
                      AI has drafted a message for <strong>{reviewingJob.company}</strong>. Please verify in Chrome and confirm.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirm(reviewingJob.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-white text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] transition-all"
                      >
                        <Send className="w-3 h-3" />
                        Confirm Send
                      </button>
                      <button
                        onClick={() => handleSkipReview(reviewingJob.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 border border-white/10 text-text-secondary text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all"
                      >
                        <XCircle className="w-3 h-3" />
                        Skip
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isRunning ? (
                <button
                  onClick={() => {
                    if (window.confirm("Ready to start applying? This will open Chrome and begin the automation flow for all pending jobs.")) {
                      startAutomation();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-accent text-white font-bold uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-accent/20"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Run Automation
                </button>
              ) : (
                <button
                  onClick={stopAutomation}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-error/20 border border-error/30 text-error font-bold uppercase tracking-widest hover:bg-error/30 transition-all"
                >
                  <Square className="w-4 h-4 fill-current" />
                  Stop Execution
                </button>
              )}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Live Metrics</h4>
            <div className="space-y-4">
              <MetricItem label="Browser Instances" value={isRunning ? "1 Active" : "0"} />
              <MetricItem label="AI Response Time" value="1.2s avg" />
              <MetricItem label="Memory Usage" value="244MB" />
            </div>
          </div>
        </div>

        {/* Terminal Card */}
        <div className="md:col-span-2">
          <div className="h-[500px] rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex flex-col shadow-2xl">
            <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-text-muted" />
                <span className="text-xs font-bold uppercase tracking-widest text-text-muted">System Terminal</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-error/20 border border-error/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-warning/20 border border-warning/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-success/20 border border-success/30" />
              </div>
            </div>
            
            <div 
              ref={logContainerRef}
              className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 scrollbar-thin scrollbar-thumb-white/10"
            >
              <AnimatePresence initial={false}>
                {logs.length === 0 && !isRunning && (
                  <div className="h-full flex flex-col items-center justify-center text-text-muted space-y-2 opacity-50">
                    <TerminalIcon className="w-8 h-8" />
                    <p>Terminal ready. Awaiting command...</p>
                  </div>
                )}
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 leading-relaxed"
                  >
                    <span className="text-text-muted shrink-0">[{log.timestamp}]</span>
                    <span className={`
                      ${log.type === "info" ? "text-text-secondary" : ""}
                      ${log.type === "warn" ? "text-warning" : ""}
                      ${log.type === "error" ? "text-error" : ""}
                      ${log.type === "system" ? "text-accent font-bold" : ""}
                    `}>
                      {log.message}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isRunning && (
                <div className="flex items-center gap-2 text-accent animate-pulse">
                  <span>_</span>
                  <Loader2 className="w-3 h-3 animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{label}</span>
      <span className="text-xs font-mono text-white">{value}</span>
    </div>
  );
}
