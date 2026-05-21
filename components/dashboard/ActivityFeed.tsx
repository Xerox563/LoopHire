"use client";

import { motion } from "framer-motion";
import { JobRecord } from "@/types";
import { formatDate, statusColor } from "@/lib/utils";
import { Activity, Zap, CheckCircle2, XCircle, MinusCircle, Clock } from "lucide-react";

/**
 * Sidebar component showing recent application events
 */
export default function ActivityFeed({ jobs }: { jobs: JobRecord[] }) {
  // Get the most recent 10 non-pending applications
  const recent = [...jobs]
    .filter((j) => j.status !== "pending")
    .sort((a, b) => new Date(b.appliedAt || 0).getTime() - new Date(a.appliedAt || 0).getTime())
    .slice(0, 10);

  const getStatusIcon = (status: JobRecord["status"]) => {
    switch (status) {
      case "applied": return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "failed": return <XCircle className="w-4 h-4 text-error" />;
      case "skipped": return <MinusCircle className="w-4 h-4 text-text-muted" />;
      case "reviewing": return <Zap className="w-4 h-4 text-accent animate-pulse" />;
      default: return <Clock className="w-4 h-4 text-warning" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card !p-8 h-full"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
          <Activity className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-white tracking-tight">Activity Feed</h3>
          <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Real-time Events</p>
        </div>
      </div>

      {recent.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/10 mb-4" />
          <p className="text-sm text-text-muted italic">
            No recent activity to display.
          </p>
        </div>
      ) : (
        <div className="relative space-y-4">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-bottom from-border via-border to-transparent" />

          {recent.map((job, i) => (
            <motion.div 
              key={job.id}
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.5 + i * 0.1 }}
              className="relative flex items-center gap-5 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300 group"
            >
              {/* Status Icon Wrapper */}
              <div className="relative z-10 w-12 h-12 rounded-xl bg-surface-2 border border-white/10 flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                {getStatusIcon(job.status)}
              </div>

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-bold text-white truncate group-hover:text-accent transition-colors">
                    {job.company}
                  </p>
                  <span className="text-[10px] font-bold text-text-muted whitespace-nowrap">
                    {formatDate(job.appliedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-text-secondary truncate">
                    {job.role}
                  </p>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <span 
                    className="text-[10px] font-bold uppercase tracking-tighter"
                    style={{ color: statusColor(job.status) }}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
