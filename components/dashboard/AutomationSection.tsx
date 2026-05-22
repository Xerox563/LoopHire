"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, Terminal as TerminalIcon, Cpu, AlertCircle, CheckCircle2, Loader2, Save, Send, XCircle } from "lucide-react";
import { JobRecord } from "@/types";
import { ResumeData } from "./ResumeSection";
import { supabase } from "@/lib/supabase";
import { useAutomation } from "@/components/providers/AutomationProvider";

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
  const { isRunning, logs, progress, startAutomation, stopAutomation } = useAutomation();
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Filter jobs to find if any are currently 'reviewing'
  const reviewingJob = jobs.find(j => j.status === "reviewing");

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleStart = async () => {
    if (!resumeData) {
      alert("Please upload and parse your resume first.");
      return;
    }
    await startAutomation(jobs, resumeData);
  };

  const handleConfirm = async (id: string) => {
    try {
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
    } catch (err: any) {
      console.error("Confirmation error:", err);
    }
  };

  const handleSkipReview = async (id: string) => {
    try {
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
    } catch (err: any) {
      console.error("Skip error:", err);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        {/* Control Card */}
        <div className="lg:col-span-1 space-y-6 lg:space-y-8">
          <div className="glass-card !p-6 lg:!p-8 space-y-6 lg:space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                <Cpu className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-display font-bold text-white tracking-tight text-center lg:text-left">Engine Control</h3>
                <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold text-center lg:text-left">Automation Core</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                  <span className="text-text-muted">Current Progress</span>
                  <span className="text-accent">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-accent to-accent-light shadow-[0_0_10px_rgba(255,102,64,0.4)]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {!isRunning ? (
                  <button
                    onClick={() => {
                      if (window.confirm("Ready to start applying? This will open Chrome and begin the automation flow for all pending jobs.")) {
                        handleStart();
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
          </div>

          <div className="glass-card !p-6 lg:!p-8">
            <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] mb-6">Engine Status</h4>
            <div className="space-y-5">
              {[
                { label: "AI Engine", status: isRunning ? "Operational" : "Idle", color: isRunning ? "text-success" : "text-text-muted" },
                { label: "Browser Core", status: isRunning ? "Active" : "Idle", color: isRunning ? "text-success" : "text-text-muted" },
                { label: "Neural Flow", status: isRunning ? "Processing" : "Idle", color: isRunning ? "text-accent" : "text-text-muted" }
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-secondary">{s.label}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'Idle' ? 'bg-white/10' : 'bg-current animate-pulse'} ${s.color}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${s.color}`}>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terminal Log */}
        <div className="lg:col-span-2 glass-card !p-0 flex flex-col min-h-[400px] lg:min-h-0">
          <div className="px-4 lg:px-6 py-4 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TerminalIcon className="w-4 h-4 text-accent" />
              <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">Output Logs</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
            </div>
          </div>
          <div 
            ref={logContainerRef}
            className="flex-1 p-4 lg:p-6 font-mono text-xs overflow-y-auto space-y-3 custom-scrollbar bg-black/20"
          >
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 opacity-20 py-10">
                <TerminalIcon className="w-12 h-12" />
                <p className="text-[11px] font-bold uppercase tracking-widest">Awaiting initialization...</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex gap-4 group">
                  <span className="text-text-muted shrink-0 select-none">[{log.timestamp}]</span>
                  <span className={`uppercase font-bold tracking-widest shrink-0 w-12 select-none ${
                    log.type === 'error' ? 'text-error' :
                    log.type === 'warn' ? 'text-warning' :
                    log.type === 'system' ? 'text-accent' :
                    'text-success'
                  }`}>{log.type}</span>
                  <span className="text-text-secondary leading-relaxed break-words">{log.message}</span>
                </div>
              ))
            )}
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
