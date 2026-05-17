"use client";

import { motion, AnimatePresence } from "framer-motion";
import { JobRecord, JobStatus } from "@/types";
import { formatDate, statusColor } from "@/lib/utils";
import { useState } from "react";

const STATUS_LABELS: Record<JobStatus, string> = {
  pending: "Pending",
  applied: "Applied",
  failed: "Failed",
  skipped: "Skipped",
};

const STATUS_ICONS: Record<JobStatus, string> = {
  pending: "⏳",
  applied: "✅",
  failed: "❌",
  skipped: "⏭️",
};

type FilterStatus = JobStatus | "all";

/**
 * Interactive table for displaying and managing job applications
 */
export default function JobsTable({ jobs, onDelete }: { jobs: JobRecord[]; onDelete?: (id: string) => void }) {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");

  // Apply search and status filters
  const filtered = jobs.filter((j) => {
    const matchStatus = filter === "all" || j.status === filter;
    const matchSearch = !search || 
      j.company.toLowerCase().includes(search.toLowerCase()) || 
      j.role.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filters: FilterStatus[] = ["all", "pending", "applied", "failed", "skipped"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl overflow-hidden" 
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Table Header with Search and Filters */}
      <div 
        className="px-6 py-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <h2 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
            Job Applications
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {filtered.length} of {jobs.length} jobs
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {/* Company/Role Search Input */}
          <input 
            value={search} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search company or role…"
            className="text-sm px-4 py-2 rounded-xl outline-none"
            style={{ 
              background: "var(--surface-2)", 
              border: "1px solid var(--border)", 
              color: "var(--text-primary)", 
              width: 220 
            }} 
          />
          {/* Status Filter Tabs */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--surface-2)" }}>
            {filters.map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                style={{
                  background: filter === f ? "var(--accent)" : "transparent",
                  color: filter === f ? "white" : "var(--text-secondary)",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Company", "Role", "Status", "Applied At", "Notes", ""].map(h => (
                <th 
                  key={h} 
                  className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16" style={{ color: "var(--text-muted)" }}>
                    No jobs found
                  </td>
                </tr>
              ) : filtered.map((job, i) => (
                <motion.tr 
                  key={job.id}
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td className="px-6 py-4 font-medium" style={{ color: "var(--text-primary)" }}>
                    <a 
                      href={job.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline" 
                      style={{ color: "var(--text-primary)" }}
                    >
                      {job.company || "—"}
                    </a>
                  </td>
                  <td className="px-6 py-4" style={{ color: "var(--text-secondary)", maxWidth: 200 }}>
                    <span className="truncate block">{job.role || "—"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: statusColor(job.status) + "15", color: statusColor(job.status) }}
                    >
                      <span>{STATUS_ICONS[job.status]}</span>
                      {STATUS_LABELS[job.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4" style={{ color: "var(--text-muted)" }}>
                    {formatDate(job.appliedAt)}
                  </td>
                  <td className="px-6 py-4 max-w-xs" style={{ color: "var(--text-muted)" }}>
                    <span className="truncate block text-xs">
                      {job.failureReason || job.notes || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(job.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        style={{ color: "var(--text-muted)" }}
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
