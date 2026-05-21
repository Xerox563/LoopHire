"use client";

import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { JobRecord } from "@/types";
import { computeStats } from "@/lib/utils";
import DashboardNav from "@/components/dashboard/DashboardNav";
import StatsCards from "@/components/dashboard/StatsCards";
import JobsTable from "@/components/dashboard/JobsTable";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import AddJobModal from "@/components/dashboard/AddJobModal";
import ResumeSection, { ResumeData } from "@/components/dashboard/ResumeSection";
import AutomationSection from "@/components/dashboard/AutomationSection";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * Main dashboard page for managing and tracking job applications
 */
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "resume" | "automation">("overview");
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [resumeData, setResumeData] = useState<ResumeData | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadJobs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        const formattedJobs: JobRecord[] = data.map(j => ({
          id: j.id,
          url: j.url,
          company: j.company,
          role: j.role,
          status: j.status,
          appliedAt: j.applied_at,
          failureReason: j.failure_reason,
          notes: j.notes,
          outreachMessage: j.outreach_message,
          outreachSubject: j.outreach_subject,
        }));
        setJobs(formattedJobs);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load jobs on mount
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Poll for updates while in Automation tab to catch 'reviewing' status changes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTab === "automation") {
      interval = setInterval(() => {
        loadJobs();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeTab, loadJobs]);

  // Derive statistics from current job list
  const stats = computeStats(jobs);

  // Helper for displaying temporary feedback messages
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // Handle adding a new job manually
  const handleAdd = useCallback(async (url: string, company: string, role: string, notes: string) => {
    const id = `job_${Date.now()}`;
    const newJob: JobRecord = {
      id,
      url, 
      company, 
      role, 
      notes: notes || undefined,
      status: "pending",
    };

    // Save to Supabase via server-side proxy
    const response = await fetch("/api/db", {
      method: "POST",
      body: JSON.stringify({
        table: "jobs",
        action: "insert",
        data: {
          id,
          url,
          company,
          role,
          notes: notes || null,
          status: "pending",
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Supabase error:", error);
      showToast("Failed to save job to database");
      return;
    }

    setJobs(prev => [newJob, ...prev]);
    showToast(`Successfully added: ${company || "New Job"}`);
  }, []);

  // Handle removing a job from the list
  const handleDelete = useCallback(async (id: string) => {
    const response = await fetch("/api/db", {
      method: "POST",
      body: JSON.stringify({
        table: "jobs",
        action: "delete",
        query: { id }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error("Supabase error:", error);
      showToast("Failed to remove job from database");
      return;
    }

    setJobs(prev => prev.filter((j: JobRecord) => j.id !== id));
    showToast("Application removed from tracker");
  }, []);

  // Handle clearing all jobs from the database
  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all job applications? This cannot be undone.")) {
      return;
    }

    // Since our generic proxy doesn't support complex filters like .neq easily without security risks,
    // we'll just handle this as a specialized update or simple delete match if possible.
    // For "delete all", we can use a query that matches everything.
    const response = await fetch("/api/db", {
      method: "POST",
      body: JSON.stringify({
        table: "jobs",
        action: "delete",
        query: {} // Match all
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error("Supabase error:", error);
      showToast("Failed to clear database");
      return;
    }

    setJobs([]);
    showToast("Database cleared successfully");
  };

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-accent/30">
      {/* Background Effects */}
      <div className="fixed inset-0 glow-mesh pointer-events-none opacity-40" />
      <div className="noise-bg" />

      {/* Navigation */}
      <DashboardNav />

      <main className="relative max-w-7xl mx-auto px-6 py-12 z-10">
        {/* Page Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="font-display text-5xl font-bold tracking-tight mb-3 text-gradient">
              {activeTab === "overview" ? "Dashboard" : activeTab === "resume" ? "Profile" : "Automation"}
            </h1>
            <p className="text-text-secondary text-lg max-w-xl">
              {activeTab === "overview" 
                ? "Manage and track your job applications in one central hub." 
                : activeTab === "resume" 
                ? "Fine-tune your professional profile and resume sections." 
                : "Configure and monitor your automated application workflows."}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="flex p-1.5 rounded-2xl bg-surface/50 border border-border backdrop-blur-xl">
              {[
                { id: "overview", label: "Overview" },
                { id: "resume", label: "Resume" },
                { id: "automation", label: "Automation" }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                    activeTab === tab.id 
                      ? "text-white" 
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-accent rounded-xl shadow-[0_0_20px_rgba(255,102,64,0.3)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <div className="flex gap-3">
                <button 
                  onClick={handleClearAll}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border border-error/20 bg-error/5 text-error hover:bg-error/10 transition-all flex items-center gap-2"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setModalOpen(true)}
                  className="btn-cinematic !px-6 !py-2.5 !text-xs !font-bold !uppercase !tracking-widest flex items-center gap-2"
                >
                  <span className="text-lg leading-none">＋</span> Add Job
                </button>
              </div>
            )}
          </motion.div>
        </header>

        {/* Tab Content with AnimatePresence */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-10"
        >
          {activeTab === "overview" && (
            <>
              {/* Stats Grid */}
              <section>
                {isLoading ? (
                  <div className="h-32 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                  </div>
                ) : (
                  <StatsCards stats={stats} />
                )}
              </section>

              {/* Success Rate Visualizer */}
              <section className="glass-card !p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Application Health</h3>
                    <p className="text-sm text-text-secondary">Overall success rate across all platforms</p>
                  </div>
                  <span className="text-3xl font-display font-bold accent-gradient">
                    {stats.successRate}%
                  </span>
                </div>
                <div className="h-3 rounded-full bg-surface-2 overflow-hidden p-0.5 border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.successRate}%` }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-right from-accent to-accent-2 shadow-[0_0_15px_rgba(255,102,64,0.4)]"
                  />
                </div>
              </section>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                <div className="xl:col-span-2">
                  <JobsTable 
                    jobs={jobs} 
                    onDelete={handleDelete}
                    isLoading={isLoading}
                  />
                </div>
                <div className="xl:col-span-1">
                  <ActivityFeed jobs={jobs} />
                </div>
              </div>
            </>
          )}

          {activeTab === "resume" && (
            <ResumeSection 
              onUpdate={setResumeData}
              initialData={resumeData}
            />
          )}

          {activeTab === "automation" && (
            <AutomationSection jobs={jobs} resumeData={resumeData} />
          )}
        </motion.div>
      </main>

      {/* Modals & Toasts */}
      <AddJobModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onAdd={handleAdd} 
      />

      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-white text-background font-bold shadow-2xl flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          {toast}
        </motion.div>
      )}
    </div>
  );
}
