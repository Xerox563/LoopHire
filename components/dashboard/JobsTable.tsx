"use client";

import { motion, AnimatePresence } from "framer-motion";
import { JobRecord, JobStatus } from "@/types";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { 
  Search, 
  ExternalLink, 
  Trash2, 
  Filter,
  MoreHorizontal
} from "lucide-react";

const STATUS_CONFIG: Record<JobStatus, { label: string; icon: string; color: string }> = {
  pending: { label: "Pending", icon: "⏳", color: "#f59e0b" },
  applied: { label: "Applied", icon: "✅", color: "#10b981" },
  failed: { label: "Failed", icon: "❌", color: "#ef4444" },
  skipped: { label: "Skipped", icon: "⏭️", color: "#a1a1aa" },
};

type FilterStatus = JobStatus | "all";

/**
 * Enterprise-Grade Jobs Table
 * Features: Cinematic hover, glassmorphism, advanced filtering
 */
export default function JobsTable({ jobs, onDelete }: { jobs: JobRecord[]; onDelete?: (id: string) => void }) {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");

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
      className="glass-card !p-0"
    >
      {/* Table Toolbar */}
      <div className="px-8 py-6 border-b border-white/5 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-1">Application Nodes</h2>
          <p className="text-xs font-medium text-text-muted uppercase tracking-widest">
            {filtered.length} active instances
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          {/* Futuristic Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by company or role..."
              className="pl-11 pr-6 py-2.5 rounded-xl bg-white/5 border border-white/10 outline-none text-sm w-[260px] focus:border-accent/50 focus:bg-white/[0.08] transition-all"
            />
          </div>

          {/* Minimal Filter Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            {filters.map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filter === f ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modern Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {["Identity", "Node Status", "Timestamp", "System Notes", ""].map((h, i) => (
                <th 
                  key={h} 
                  className={`px-8 py-4 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted ${i === 4 ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan={5} className="text-center py-20 text-sm text-text-muted italic">
                    No matching application nodes found in the current buffer.
                  </td>
                </motion.tr>
              ) : filtered.map((job, i) => (
                <motion.tr 
                  key={job.id}
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm tracking-tight group-hover:text-accent transition-colors">
                        {job.company || "Unknown Entity"}
                      </span>
                      <span className="text-xs text-text-secondary mt-1">
                        {job.role || "Standard Role"}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-8 py-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5">
                      <span className="text-xs">{STATUS_CONFIG[job.status].icon}</span>
                      <span 
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: STATUS_CONFIG[job.status].color }}
                      >
                        {STATUS_CONFIG[job.status].label}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <span className="text-xs text-text-muted font-mono">
                      {formatDate(job.appliedAt)}
                    </span>
                  </td>

                  <td className="px-8 py-5 max-w-xs">
                    <span className="text-xs text-text-secondary truncate block">
                      {job.failureReason || job.notes || "—"}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-white/10 text-text-muted hover:text-white transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(job.id)}
                          className="p-2 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
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
