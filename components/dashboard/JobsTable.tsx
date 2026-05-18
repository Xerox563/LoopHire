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
  AlertCircle
} from "lucide-react";
import { useState, Fragment } from "react";

interface Props {
  jobs: JobRecord[];
  onDelete: (id: string) => void;
}

/**
 * Enhanced Jobs Table with Outreach Message visibility
 */
export default function JobsTable({ jobs, onDelete }: Props) {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  if (jobs.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-text-muted" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No applications yet</h3>
        <p className="text-sm text-text-muted max-w-xs">
          Add your first job URL to start tracking your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted">Company & Role</th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted text-center">Status</th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted">Applied At</th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {jobs.map((job) => (
              <Fragment key={job.id}>
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover:text-accent transition-colors">
                        {job.company || "Unknown Company"}
                      </span>
                      <span className="text-xs text-text-secondary mt-0.5">
                        {job.role || "Role not specified"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <StatusBadge status={job.status} />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs text-text-muted font-mono">
                      {job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      {job.outreachMessage && (
                        <button 
                          onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                          className="p-2 rounded-lg bg-white/5 text-text-muted hover:text-accent hover:bg-accent/10 transition-all"
                          title="View Outreach Message"
                        >
                          {expandedJob === job.id ? <ChevronUp className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                        </button>
                      )}
                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button 
                        onClick={() => onDelete(job.id)}
                        className="p-2 rounded-lg bg-white/5 text-text-muted hover:text-error hover:bg-error/10 transition-all"
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
                      className="bg-accent/[0.02]"
                    >
                      <td colSpan={4} className="px-8 py-6 border-b border-white/5">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent">
                            <MessageSquare className="w-3 h-3" />
                            Generated Outreach Message
                          </div>
                          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
                            {job.outreachSubject && (
                              <div className="text-xs font-bold text-white border-b border-white/5 pb-2">
                                <span className="text-text-muted mr-2">Subject:</span>
                                {job.outreachSubject}
                              </div>
                            )}
                            <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                              {job.outreachMessage}
                            </div>
                          </div>
                        </div>
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
  const styles = {
    applied: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    failed: "bg-error/10 text-error border-error/20",
    skipped: "bg-white/5 text-text-muted border-white/10",
    reviewing: "bg-accent/10 text-accent border-accent/20 animate-pulse",
    confirmed: "bg-success/20 text-success border-success/30",
  };

  const icons = {
    applied: <CheckCircle2 className="w-3 h-3" />,
    pending: <Clock className="w-3 h-3" />,
    failed: <XCircle className="w-3 h-3" />,
    skipped: <MinusCircle className="w-3 h-3" />,
    reviewing: <AlertCircle className="w-3 h-3" />,
    confirmed: <CheckCircle2 className="w-3 h-3" />,
  };

  return (
    <div className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1.5 ${styles[status]}`}>
      {icons[status]}
      {status}
    </div>
  );
}
