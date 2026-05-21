"use client";

import { motion, AnimatePresence } from "framer-motion";
import { JobRecord } from "@/types";
import { 
  ExternalLink, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MinusCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useState, Fragment } from "react";

interface Props {
  jobs: JobRecord[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

/**
 * Enhanced Jobs Table with Outreach Message visibility
 */
export default function JobsTable({ jobs, onDelete, isLoading }: Props) {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="glass-card flex flex-col items-center justify-center text-center py-20">
        <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
        <h3 className="text-lg font-bold text-white mb-1">Loading applications...</h3>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center text-center py-20">
        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-text-muted" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No applications yet</h3>
        <p className="text-sm text-text-secondary max-w-xs mx-auto">
          Add your first job URL to start tracking your progress in one beautiful dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card !p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">Company & Role</th>
              <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted text-center">Status</th>
              <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">Applied At</th>
              <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {jobs.map((job) => (
              <Fragment key={job.id}>
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-white/[0.02] transition-all duration-300"
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-white group-hover:text-accent transition-colors duration-300">
                        {job.company || "Unknown Company"}
                      </span>
                      <span className="text-sm text-text-secondary mt-1">
                        {job.role || "Role not specified"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <StatusBadge status={job.status} />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs text-text-muted font-mono tracking-wider">
                      {job.appliedAt ? new Date(job.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3">
                      {job.outreachMessage && (
                        <button 
                          onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                          className={`p-2.5 rounded-xl transition-all duration-300 ${
                            expandedJob === job.id 
                              ? "bg-accent text-white shadow-[0_0_15px_rgba(255,102,64,0.3)]" 
                              : "bg-white/5 text-text-muted hover:text-accent hover:bg-accent/10"
                          }`}
                        >
                          {expandedJob === job.id ? <ChevronUp className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                        </button>
                      )}
                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-all duration-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button 
                        onClick={() => onDelete(job.id)}
                        className="p-2.5 rounded-xl bg-white/5 text-text-muted hover:text-error hover:bg-error/10 transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
                
                {/* Expanded Outreach Message Row */}
                <AnimatePresence>
                  {expandedJob === job.id && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-accent/[0.01] overflow-hidden"
                    >
                      <td colSpan={4} className="px-10 py-8 border-b border-white/5">
                        <motion.div 
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="space-y-6"
                        >
                          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] accent-gradient">
                            <MessageSquare className="w-4 h-4 text-accent" />
                            Generated Outreach Message
                          </div>
                          <div className="p-6 rounded-2xl bg-surface/50 border border-white/5 shadow-2xl space-y-4">
                            {job.outreachSubject && (
                              <div className="text-sm font-bold text-white border-b border-white/5 pb-3 flex items-center gap-3">
                                <span className="text-text-muted text-[10px] uppercase tracking-widest">Subject</span>
                                {job.outreachSubject}
                              </div>
                            )}
                            <div className="text-[15px] text-text-secondary leading-relaxed whitespace-pre-wrap font-body italic">
                              "{job.outreachMessage}"
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: JobRecord["status"] }) {
  const styles: Record<string, string> = {
    applied: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    failed: "bg-error/10 text-error border-error/20",
    skipped: "bg-white/5 text-text-muted border-white/10",
    reviewing: "bg-accent/15 text-accent border-accent/30 animate-pulse shadow-[0_0_15px_rgba(255,102,64,0.1)]",
    confirmed: "bg-success/20 text-success border-success/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    invalid: "bg-white/5 text-text-muted border-white/10",
  };

  const icons: Record<string, React.ReactNode> = {
    applied: <CheckCircle2 className="w-3.5 h-3.5" />,
    pending: <Clock className="w-3.5 h-3.5" />,
    failed: <XCircle className="w-3.5 h-3.5" />,
    skipped: <MinusCircle className="w-3.5 h-3.5" />,
    reviewing: <AlertCircle className="w-3.5 h-3.5" />,
    confirmed: <CheckCircle2 className="w-3.5 h-3.5" />,
    invalid: <MinusCircle className="w-3.5 h-3.5" />,
  };

  return (
    <div className={`px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all duration-300 ${styles[status]}`}>
      {icons[status]}
      {status}
    </div>
  );
}
