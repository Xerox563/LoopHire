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

  // Load jobs from Supabase on mount
  useEffect(() => {
    async function loadJobs() {
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
    }
    loadJobs();
  }, []);

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

    // Save to Supabase
    const { error } = await supabase.from("jobs").insert({
      id,
      url,
      company,
      role,
      notes: notes || null,
      status: "pending",
    });

    if (error) {
      console.error("Supabase error:", error);
      showToast("Failed to save job to database");
      return;
    }

    setJobs(prev => [newJob, ...prev]);
    showToast(`Successfully added: ${company || "New Job"}`);
  }, []);

  // Handle removing a job from the list
  const handleDelete = useCallback(async (id: string) => {
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    
    if (error) {
      console.error("Supabase error:", error);
      showToast("Failed to remove job from database");
      return;
    }

    setJobs(prev => prev.filter((j: JobRecord) => j.id !== id));
    showToast("Application removed from tracker");
  }, []);

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      {/* Dashboard navigation bar */}
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8 flex items-end justify-between"
        >
          <div>
            <h1 className="font-display text-4xl mb-1" style={{ color: "var(--text-primary)" }}>
              {activeTab === "overview" ? "Dashboard Overview" : activeTab === "resume" ? "Resume Profile" : "Automation Control"}
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {activeTab === "overview" 
                ? "Manage and track your job search progress" 
                : activeTab === "resume" 
                ? "Your parsed resume sections used for AI personalization" 
                : "Run and monitor your application automation"}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex p-1 rounded-xl bg-white/5 border border-white/10">
              <button 
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "overview" ? "bg-accent text-white" : "text-text-muted hover:text-white"}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab("resume")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "resume" ? "bg-accent text-white" : "text-text-muted hover:text-white"}`}
              >
                Resume
              </button>
              <button 
                onClick={() => setActiveTab("automation")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "automation" ? "bg-accent text-white" : "text-text-muted hover:text-white"}`}
              >
                Automation
              </button>
            </div>
            {activeTab === "overview" && (
              <motion.button 
                whileHover={{ scale: 1.04, y: -2 }} 
                whileTap={{ scale: 0.96 }}
                onClick={() => setModalOpen(true)}
                className="btn-primary px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
              >
                <span>＋</span> Add New Job
              </motion.button>
            )}
          </div>
        </motion.div>

        {activeTab === "overview" && (
          <>
            {/* Overview Stats Cards */}
        <div className="mb-8">
          {isLoading ? (
            <div className="h-32 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : (
            <StatsCards stats={stats} />
          )}
        </div>

            {/* Application Success Progress Visualization */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.3 }}
              className="mb-8 rounded-2xl p-6" 
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Overall Success Rate
                </span>
                <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>
                  {stats.successRate}% successful applications
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${stats.successRate}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }} 
                />
              </div>
              <div className="flex gap-6 mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                <span><span style={{ color: "#22c55e" }}>●</span> {stats.applied} applied</span>
                <span><span style={{ color: "#eab308" }}>●</span> {stats.pending} pending</span>
                <span><span style={{ color: "#ef4444" }}>●</span> {stats.failed} failed</span>
                <span><span style={{ color: "#8888aa" }}>●</span> {stats.skipped} skipped</span>
              </div>
            </motion.div>

            {/* Main Content: Jobs Table and Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center bg-white/[0.02] rounded-2xl border border-white/5">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                  </div>
                ) : (
                  <JobsTable jobs={jobs} onDelete={handleDelete} />
                )}
              </div>
              <div className="lg:col-span-1">
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center bg-white/[0.02] rounded-2xl border border-white/5">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                  </div>
                ) : (
                  <ActivityFeed jobs={jobs} />
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "resume" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ResumeSection 
              initialData={resumeData} 
              onUpdate={(data) => {
                setResumeData(data);
                showToast("Resume profile updated");
              }} 
            />
          </motion.div>
        )}

        {activeTab === "automation" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AutomationSection jobs={jobs} resumeData={resumeData} />
          </motion.div>
        )}
      </div>

      {/* Add Job Modal Dialog */}
      <AddJobModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />

      {/* Dynamic Toast Feedback */}
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 px-4 py-2 rounded-lg text-sm font-medium z-50"
          style={{ background: "var(--surface)", border: "1px solid var(--border-bright)", color: "var(--text-primary)" }}
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
}
