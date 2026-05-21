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
      const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "";
      const apiEndpoint = workerUrl ? `${workerUrl}/run-automation` : "/api/run-automation";
      
      addLog(`Connecting to engine at ${apiEndpoint}...`, "info");

      const response = await fetch(apiEndpoint, {
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
    try {
      addLog(`Confirming application for job ${id} via server...`, "info");
      
      const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "";
      const apiEndpoint = workerUrl ? `${workerUrl}/confirm-job` : "/api/confirm-job";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: JSON.stringify({ id, action: "confirm" }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Server failed to update status");
      }
      
      addLog("Application confirmed. Proceeding with submission...", "system");
    } catch (err: any) {
      console.error("Confirmation error:", err);
      addLog(`Critical error: ${err.message || String(err)}`, "error");
    }
  };

  const handleSkipReview = async (id: string) => {
    try {
      addLog(`Skipping job ${id} via server...`, "info");
      
      const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "";
      const apiEndpoint = workerUrl ? `${workerUrl}/confirm-job` : "/api/confirm-job";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: JSON.stringify({ id, action: "skip" }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Server failed to update status");
      }

      addLog("Application skipped by user.", "warn");
    } catch (err: any) {
      console.error("Skip error:", err);
      addLog(`Critical error: ${err.message || String(err)}`, "error");
    }
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Control Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card !p-8 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                <Cpu className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white tracking-tight">Engine Control</h3>
                <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Automation Core</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary font-medium">Core Status</span>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-success animate-pulse" : "bg-text-muted"}`} />
                  <span className={`text-[11px] font-bold uppercase tracking-widest ${isRunning ? "text-success" : "text-text-muted"}`}>
                    {isRunning ? "Active" : "Standby"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">
                  <span>Task Pipeline</span>
                  <span className="text-accent">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(255,102,64,0.4)]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {reviewingJob && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-2xl bg-accent/5 border border-accent/20 space-y-5 shadow-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Action Required
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      AI has drafted a message for <span className="text-white font-bold">{reviewingJob.company}</span>. Please verify and confirm submission.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleConfirm(reviewingJob.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent text-white text-[11px] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-accent/20"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleSkipReview(reviewingJob.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 border border-white/10 text-text-secondary text-[11px] font-bold uppercase tracking-widest hover:text-white hover:bg-white/10 active:scale-[0.98] transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" />
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
                  className="btn-cinematic w-full !py-5 flex items-center justify-center gap-3 !text-[11px] !font-bold !uppercase !tracking-[0.2em]"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Initialize Core
                </button>
              ) : (
                <button
                  onClick={stopAutomation}
                  className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-error/10 border border-error/20 text-error font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-error/20 active:scale-[0.98] transition-all"
                >
                  <Square className="w-5 h-5 fill-current" />
                  Terminate Flow
                </button>
              )}
            </div>
          </div>

          <div className="glass-card !p-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted mb-6">Environment Metrics</h4>
            <div className="space-y-5">
              <MetricItem label="Browser Cluster" value={isRunning ? "1 Active" : "Standby"} />
              <MetricItem label="AI Latency" value="1.2s avg" />
              <MetricItem label="Memory State" value="244MB" />
            </div>
          </div>
        </div>

        {/* Terminal Card */}
        <div className="lg:col-span-2">
          <div className="glass-card !p-0 overflow-hidden flex flex-col h-full min-h-[600px] border-accent/20">
            {/* Terminal Header */}
            <div className="px-8 py-5 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-error/50" />
                  <div className="w-3 h-3 rounded-full bg-warning/50" />
                  <div className="w-3 h-3 rounded-full bg-success/50" />
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-accent" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">Live Execution Logs</span>
                </div>
              </div>
              <div className="text-[10px] font-mono text-text-muted">
                SSH: loophire@neural-core
              </div>
            </div>

            {/* Terminal Content */}
            <div 
              ref={logContainerRef}
              className="flex-1 p-8 overflow-y-auto font-mono text-sm space-y-3 bg-[#050505]"
            >
              {logs.length === 0 && !isRunning && (
                <div className="h-full flex flex-col items-center justify-center text-text-muted space-y-4 opacity-30">
                  <TerminalIcon className="w-12 h-12" />
                  <p className="text-xs uppercase tracking-[0.3em]">Awaiting Command Initialization...</p>
                </div>
              )}
              {logs.map((log) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={log.id} 
                  className="flex gap-4 group"
                >
                  <span className="text-text-muted select-none whitespace-nowrap opacity-50">[{log.timestamp}]</span>
                  <span className={`font-bold select-none whitespace-nowrap ${
                    log.type === "error" ? "text-error" : 
                    log.type === "warn" ? "text-warning" : 
                    log.type === "system" ? "text-accent" : "text-success"
                  }`}>
                    {log.type.toUpperCase()}
                  </span>
                  <span className="text-text-secondary group-hover:text-white transition-colors">{log.message}</span>
                </motion.div>
              ))}
              {isRunning && (
                <div className="flex gap-4 animate-pulse">
                  <span className="text-text-muted">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-accent font-bold uppercase tracking-widest">EXECUTING</span>
                  <span className="text-white">Processing next instruction set...</span>
                  <span className="w-2 h-5 bg-accent animate-[blink_1s_infinite]" />
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
