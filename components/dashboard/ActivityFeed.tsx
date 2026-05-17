"use client";

import { motion } from "framer-motion";
import { JobRecord } from "@/types";
import { formatDate, statusColor } from "@/lib/utils";

/**
 * Sidebar component showing recent application events
 */
export default function ActivityFeed({ jobs }: { jobs: JobRecord[] }) {
  // Get the most recent 8 non-pending applications
  const recent = [...jobs]
    .filter((j) => j.status !== "pending")
    .sort((a, b) => new Date(b.appliedAt || 0).getTime() - new Date(a.appliedAt || 0).getTime())
    .slice(0, 8);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl p-6" 
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Recent Activity
      </h3>

      {recent.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
          No activity recorded yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {recent.map((job, i) => (
            <motion.div 
              key={job.id}
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "var(--surface-2)" }}
            >
              {/* Status Icon */}
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: statusColor(job.status) + "15" }}
              >
                {job.status === "applied" ? "✅" : job.status === "failed" ? "❌" : job.status === "skipped" ? "⏭️" : "⏳"}
              </div>
              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                  {job.company} — {job.role}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {formatDate(job.appliedAt)}
                </p>
              </div>
              {/* Status Tag */}
              <span 
                className="text-xs font-medium px-2 py-0.5 rounded-full capitalize flex-shrink-0"
                style={{ background: statusColor(job.status) + "15", color: statusColor(job.status) }}
              >
                {job.status}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
