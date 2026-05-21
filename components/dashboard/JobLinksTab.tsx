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
  Send
} from "lucide-react";
import { useState, useRef } from "react";
import { JobRecord } from "@/types";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import { useAutomation } from "@/components/providers/AutomationProvider";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startAutomation } = useAutomation();

  const handleAddLink = async () => {
    if (!newUrl.trim()) return;
    setIsAdding(true);
    try {
      const { error } = await supabase.from("jobs").insert({
        id: `job_${Date.now()}`,
        url: newUrl.trim(),
        status: "pending",
        company: "Fetching...",
        role: "Analyzing..."
      });
      if (error) throw error;
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
          } as any;
        }).filter((j): j is any => j !== null);

        if (newJobs.length === 0) {
          alert("No valid job links found in file.");
          setIsAddingImport(false);
          return;
        }

        const { error } = await supabase.from("jobs").insert(newJobs);
        if (error) throw error;
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

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) alert("Delete failed");
    else onRefresh();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Job Queue</h1>
          <p className="text-text-secondary text-sm mt-1">Manage and organize your application targets.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".csv,.txt,.xlsx,.xls"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
          >
            {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4 text-success" />}
            Import CSV/XLSX
          </button>
        </div>
      </div>

      {/* Add Link Input */}
      <div className="glass-card !p-6 flex gap-4">
        <input 
          type="text" 
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Paste job application URL (LinkedIn, Indeed, etc.)"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-accent/30 transition-all"
        />
        <button 
          onClick={handleAddLink}
          disabled={isAdding || !newUrl.trim()}
          className="btn-cinematic !py-3 !px-8 !rounded-xl flex items-center gap-2 text-xs disabled:opacity-50"
        >
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add to Queue
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Pending", value: jobs.filter(j => j.status === 'pending').length, color: "#f59e0b" },
          { label: "Reviewing", value: jobs.filter(j => j.status === 'reviewing').length, color: "#3b82f6" },
          { label: "Applied", value: jobs.filter(j => j.status === 'applied').length, color: "#10b981" },
          { label: "Failed", value: jobs.filter(j => j.status === 'failed').length, color: "#ef4444" },
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
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Job URL</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Company</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Outreach Pitch</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-text-muted italic text-sm">
                    No jobs in queue. Import a file or paste a link.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="group hover:bg-white/[0.02] transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-text-secondary" />
                        </div>
                        <span className="text-xs font-medium text-white truncate max-w-[150px]">{job.url}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-text-secondary">{job.company || "Pending..."}</span>
                        <span className="text-[10px] text-text-muted">{job.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 max-w-[300px]">
                      <div className="relative group/pitch">
                        <textarea 
                          value={job.outreachMessage || ""}
                          onChange={async (e) => {
                            const newVal = e.target.value;
                            await supabase.from("jobs").update({ outreach_message: newVal }).eq("id", job.id);
                            onRefresh();
                          }}
                          className="w-full bg-white/[0.02] border border-white/5 rounded-lg p-2 text-[11px] text-text-secondary focus:outline-none focus:border-accent/30 min-h-[60px] resize-none custom-scrollbar transition-all"
                          placeholder="No pitch generated yet..."
                        />
                        <div className="absolute right-2 bottom-2 opacity-0 group-hover/pitch:opacity-100 transition-opacity">
                          <Edit3 className="w-3 h-3 text-accent/50" />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest inline-block ${
                        job.status === 'applied' ? 'bg-success/5 border-success/20 text-success' :
                        job.status === 'reviewing' ? 'bg-accent/5 border-accent/20 text-accent animate-pulse' :
                        'bg-warning/5 border-warning/20 text-warning'
                      }`}>
                        {job.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
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
    </div>
  );
}
