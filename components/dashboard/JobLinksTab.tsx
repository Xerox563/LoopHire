"use client";

import { motion } from "framer-motion";
import { 
  Plus, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  MoreHorizontal,
  Briefcase,
  ExternalLink,
  Trash2,
  Loader2,
  Edit3,
  Send,
  Eye,
  X
} from "lucide-react";
import { useState, useRef } from "react";
import { JobRecord } from "@/types";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import { useAutomation } from "@/components/providers/AutomationProvider";
import { AnimatePresence } from "framer-motion";

interface Props {
  jobs: JobRecord[];
  onRefresh: () => void;
  resumeData?: any;
}

export default function JobLinksTab({ jobs, onRefresh, resumeData }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [isImporting, setIsAddingImport] = useState(false);
  const [isSending, setIsSending] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<JobRecord | null>(null);
  const [editPitch, setEditPitch] = useState("");
  const [isSavingPitch, setIsSavingPitch] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startAutomation } = useAutomation();

  const handleAddLink = async () => {
    if (!newUrl.trim()) return;
    setIsAdding(true);
    try {
      const response = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "jobs",
          action: "insert",
          data: {
            id: `job_${Date.now()}`,
            url: newUrl.trim(),
            status: "pending",
            company: "Fetching...",
            role: "Analyzing..."
          }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add job via proxy");
      }

      setNewUrl("");
      onRefresh();
    } catch (err) {
      console.error("Add error:", err);
      alert("Failed to add link");
    } finally {
      setIsAdding(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAddingImport(true);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length < 2) {
          alert("File is empty or has no data.");
          setIsAddingImport(false);
          return;
        }

        // Find the actual header row (it might not be the first row if there's a title)
        let headerRowIdx = -1;
        for (let i = 0; i < Math.min(jsonData.length, 10); i++) {
          const row = (jsonData[i] || []).map(cell => String(cell || "").toLowerCase());
          if (row.some(h => h.includes("company") || h.includes("apply link") || h.includes("role"))) {
            headerRowIdx = i;
            break;
          }
        }

        if (headerRowIdx === -1) {
          alert("Could not find header row (Company, Apply Link, etc.). Please check your file format.");
          setIsAddingImport(false);
          return;
        }

        const headers = (jsonData[headerRowIdx] as any[]).map(h => String(h || "").trim().toLowerCase());
        const companyIdx = headers.findIndex(h => h.includes("company"));
        const roleIdx = headers.findIndex(h => h.includes("role"));
        const linkIdx = headers.findIndex(h => h.includes("link") || h.includes("url") || h.includes("apply"));
        const pitchIdx = headers.findIndex(h => h.includes("pitch") || h.includes("outreach") || h.includes("message"));

        const newJobs = jsonData.slice(headerRowIdx + 1).map(columns => {
          if (!columns || columns.length === 0) return null;
          const url = String(columns[linkIdx] || "").trim();
          if (!url || !url.startsWith("http")) return null;

          return {
            id: `job_${Math.random().toString(36).substr(2, 9)}`,
            url,
            company: String(columns[companyIdx] || "Imported").trim(),
            role: String(columns[roleIdx] || "Job").trim(),
            outreach_message: String(columns[pitchIdx] || "").trim(),
            status: "pending"
          };
        }).filter((j): j is any => j !== null);

        if (newJobs.length === 0) {
          alert("No valid job links found in file.");
          setIsAddingImport(false);
          return;
        }

        const response = await fetch("/api/db", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "jobs",
            action: "insert",
            data: newJobs
          })
        });

        if (!response.ok) {
          throw new Error("Failed to import jobs via proxy");
        }

        onRefresh();
      } catch (err) {
        console.error("Import error:", err);
        alert("Failed to parse file. Ensure it's a valid CSV or XLSX.");
      } finally {
        setIsAddingImport(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSendOne = async (job: JobRecord) => {
    if (!resumeData) {
      alert("Please upload your resume in the Resume tab first.");
      return;
    }
    
    if (window.confirm(`Start automation for ${job.company}? This will open a browser to apply.`)) {
      setIsSending(job.id);
      try {
        await startAutomation([job], resumeData);
      } catch (err) {
        console.error("Send error:", err);
      } finally {
        setIsSending(null);
        onRefresh();
      }
    }
  };

  const handleSavePitch = async () => {
    if (!editingJob) return;
    setIsSavingPitch(true);
    try {
      const response = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "jobs",
          action: "update",
          data: { outreach_message: editPitch },
          query: { id: editingJob.id }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save pitch via proxy");
      }
      
      setEditingJob(null);
      onRefresh();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save pitch");
    } finally {
      setIsSavingPitch(false);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    setIsUpdatingStatus(jobId);
    try {
      const updateData: any = { status: newStatus };
      
      // If changing to applied, set applied_at
      if (newStatus === "applied") {
        updateData.applied_at = new Date().toISOString();
      } else if (newStatus === "pending") {
        updateData.applied_at = null;
        updateData.failure_reason = null;
      }

      // Use the server-side proxy to bypass browser-level blocking (like Brave Shields)
      const response = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "jobs",
          action: "update",
          data: updateData,
          query: { id: jobId }
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Server failed to update status");
      }

      onRefresh();
    } catch (err: any) {
      console.error("Status update error:", err);
      
      // Fallback or detailed error message
      const msg = err.message === "Failed to fetch" 
        ? "Network Error: Browser blocked the request. Please check if your dev server is running or if Brave Shields are interfering."
        : err.message;
        
      alert(`Failed to update status: ${msg}`);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "jobs",
          action: "delete",
          query: { id }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to delete job via proxy");
      }
      
      onRefresh();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Search and Import */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl lg:text-3xl font-display font-bold text-white tracking-tight">Job Queue</h1>
          <p className="text-text-secondary text-sm mt-1">Manage and organize your application targets.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search queue..." 
              className="bg-white/[0.03] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent/30 transition-all w-full sm:w-64"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-text-secondary text-sm font-bold hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4 text-success" />}
              Import
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv,.txt,.xlsx,.xls"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>

      {/* Quick Add Bar */}
      <div className="glass-card !p-4 lg:!p-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Paste job application URL (LinkedIn, Indeed, etc.)" 
            className="bg-white/[0.02] border border-white/5 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-accent/30 transition-all w-full"
          />
        </div>
        <button 
          onClick={handleAddLink}
          disabled={isAdding || !newUrl.trim()}
          className="btn-cinematic !py-3.5 !px-8 !rounded-xl text-sm font-bold flex items-center gap-2 w-full sm:w-auto justify-center disabled:opacity-50"
        >
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add to Queue
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          { label: "Pending", value: jobs.filter(j => j.status === 'pending').length, color: "#f59e0b" },
          { label: "Reviewing", value: jobs.filter(j => j.status === 'reviewing').length, color: "#3b82f6" },
          { label: "Applied", value: jobs.filter(j => j.status === 'applied').length, color: "#10b981" },
          { label: "Failed", value: jobs.filter(j => j.status === 'failed').length, color: "#ef4444" },
          { label: "Invalid Info", value: jobs.filter(j => j.status === 'invalid').length, color: "#94a3b8" },
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

      {/* Jobs Table */}
      <div className="glass-card !p-0 overflow-hidden border-white/5">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-6 lg:px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Job URL</th>
                <th className="px-6 lg:px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Company</th>
                <th className="px-6 lg:px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Outreach Pitch</th>
                <th className="px-6 lg:px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Status</th>
                <th className="px-6 lg:px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-text-muted italic text-sm">
                    No jobs in queue yet. Import a file or paste a link.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="group hover:bg-white/[0.02] transition-all">
                    <td className="px-6 lg:px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-text-secondary" />
                        </div>
                        <a 
                          href={job.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs font-medium text-text-secondary hover:text-accent transition-colors truncate max-w-[150px] lg:max-w-[250px] font-mono"
                        >
                          {job.url}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 lg:px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white tracking-tight">{job.company || "Pending..."}</span>
                        <span className="text-[10px] text-text-muted font-medium">{job.role}</span>
                      </div>
                    </td>
                    <td className="px-6 lg:px-8 py-5">
                      <button 
                        onClick={() => {
                          setEditingJob(job);
                          setEditPitch(job.outreachMessage || "");
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/5 border border-accent/10 text-[11px] font-bold text-accent hover:text-accent/80 transition-all group"
                      >
                        <Eye className="w-3.5 h-3.5 text-accent" />
                        {job.outreachMessage ? "View / Edit Pitch" : "Add Pitch"}
                        <ExternalLink className="w-3 h-3 opacity-50 ml-1" />
                      </button>
                    </td>
                    <td className="px-6 lg:px-8 py-5">
                      <select 
                        value={job.status}
                        disabled={isUpdatingStatus === job.id}
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest bg-transparent cursor-pointer focus:outline-none transition-all ${
                          job.status === 'applied' ? 'bg-success/5 border-success/20 text-success' :
                          job.status === 'reviewing' ? 'bg-accent/5 border-accent/20 text-accent' :
                          job.status === 'invalid' ? 'bg-white/5 border-white/10 text-text-muted' :
                          'bg-warning/5 border-warning/20 text-warning'
                        }`}
                      >
                        <option value="pending" className="bg-background text-warning">Pending</option>
                        <option value="applied" className="bg-background text-success">Applied</option>
                        <option value="reviewing" className="bg-background text-accent">Reviewing</option>
                        <option value="invalid" className="bg-background text-text-muted">Invalid Info</option>
                        <option value="failed" className="bg-background text-error">Failed</option>
                        <option value="skipped" className="bg-background text-text-muted">Skipped</option>
                        <option value="confirmed" className="bg-background text-success">Confirmed</option>
                      </select>
                    </td>
                    <td className="px-6 lg:px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {job.status === 'pending' && (
                          <button 
                            onClick={() => handleSendOne(job)}
                            disabled={!!isSending}
                            className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-all group/send"
                            title="Send outreach and apply"
                          >
                            {isSending === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5 transition-transform" />}
                          </button>
                        )}
                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => handleDelete(job.id)}
                          className="p-2 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outreach Pitch Modal */}
      <AnimatePresence>
        {editingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-2xl !p-0 overflow-hidden shadow-2xl border-accent/20"
            >
              <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <h3 className="text-xl font-display font-bold text-white tracking-tight">Outreach Message</h3>
                  <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold mt-1">
                    {editingJob.company} — {editingJob.role}
                  </p>
                </div>
                <button 
                  onClick={() => setEditingJob(null)}
                  className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Message Content</label>
                  <textarea 
                    value={editPitch}
                    onChange={(e) => setEditPitch(e.target.value)}
                    placeholder="Craft your personalized outreach message here..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-sm text-white focus:outline-none focus:border-accent/40 min-h-[300px] resize-none custom-scrollbar transition-all leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <p className="text-[10px] text-text-muted italic">
                    Changes will be saved to the database and used for the next automation run.
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setEditingJob(null)}
                      className="px-6 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-text-secondary hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSavePitch}
                      disabled={isSavingPitch}
                      className="btn-cinematic !py-2.5 !px-8 !rounded-xl flex items-center gap-2 text-xs"
                    >
                      {isSavingPitch ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Save Pitch
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
