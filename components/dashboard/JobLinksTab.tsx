"use client";

import { motion } from "framer-motion";
import { 
  Plus, 
  Upload, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  MoreHorizontal,
  Briefcase,
  ChevronRight,
  ExternalLink,
  Trash2
} from "lucide-react";

export default function JobLinksTab() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Job Queue</h1>
          <p className="text-text-secondary text-sm mt-1">Manage and organize your application targets.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
            <FileSpreadsheet className="w-4 h-4 text-success" />
            Import CSV
          </button>
          <button className="btn-cinematic !py-2.5 !px-5 !rounded-xl flex items-center gap-2 text-xs">
            <Plus className="w-4 h-4" />
            Add Link
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Pending", value: "84", color: "#f59e0b" },
          { label: "Scraping", value: "12", color: "#3b82f6" },
          { label: "Ready", value: "32", color: "#10b981" },
          { label: "Failed", value: "5", color: "#ef4444" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card !p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
            </div>
            <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: stat.color }} />
          </div>
        ))}
      </div>

      {/* Main Table Area */}
      <div className="glass-card !p-0 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search queue..." 
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-accent/30"
              />
            </div>
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-text-muted hover:text-white transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Job Link</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Source</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Priority</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {[
                { url: "https://linkedin.com/jobs/view/123...", source: "LinkedIn", status: "Ready", priority: "High" },
                { url: "https://wellfound.com/jobs/456...", source: "Wellfound", status: "Scraping", priority: "Medium" },
                { url: "https://indeed.com/viewjob?jk=789...", source: "Indeed", status: "Pending", priority: "Low" },
                { url: "https://greenhouse.io/jobs/012...", source: "Greenhouse", status: "Ready", priority: "High" },
              ].map((job, i) => (
                <tr key={i} className="group hover:bg-white/[0.02] transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-text-secondary" />
                      </div>
                      <span className="text-xs font-medium text-white truncate max-w-xs">{job.url}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[11px] font-bold text-text-secondary">{job.source}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest inline-block ${
                      job.status === 'Ready' ? 'bg-success/5 border-success/20 text-success' :
                      job.status === 'Scraping' ? 'bg-accent/5 border-accent/20 text-accent animate-pulse' :
                      'bg-warning/5 border-warning/20 text-warning'
                    }`}>
                      {job.status}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[11px] font-bold ${job.priority === 'High' ? 'text-error' : 'text-text-muted'}`}>{job.priority}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-all"><ExternalLink className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-all"><Trash2 className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-white/5 flex items-center justify-between text-xs text-text-muted">
          <span>Showing 4 of 128 links</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
