"use client";

import { useState, useCallback, useEffect } from "react";
import { JobRecord } from "@/types";
import ResumeSection, { ResumeData } from "@/components/dashboard/ResumeSection";
import AutomationSection from "@/components/dashboard/AutomationSection";
import { supabase } from "@/lib/supabase";
import { Loader2, Menu, X } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import OverviewTab from "@/components/dashboard/OverviewTab";
import JobLinksTab from "@/components/dashboard/JobLinksTab";
import AIMessagesTab from "@/components/dashboard/AIMessagesTab";
import TemplatesTab from "@/components/dashboard/TemplatesTab";

/**
 * Main dashboard page for managing and tracking job applications
 */
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [resumeData, setResumeData] = useState<ResumeData | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loadJobs = useCallback(async () => {
    try {
      const response = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "jobs",
          action: "select",
          data: "*"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs via proxy");
      }

      const { data } = await response.json();

      if (data) {
        // The proxy returns data in its raw form, we need to sort it here since order() isn't in proxy yet
        // but the proxy select actually doesn't support complex queries like order() easily without modification
        // For now, we'll just map it.
        const formattedJobs: JobRecord[] = data.map((j: any) => ({
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
          createdAt: j.created_at
        })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
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

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <OverviewTab jobs={jobs} />;
      case "job-links":
        return <JobLinksTab jobs={jobs} onRefresh={loadJobs} resumeData={resumeData} />;
      case "ai-messages":
        return <AIMessagesTab />;
      case "resume":
        return <ResumeSection onUpdate={setResumeData} initialData={resumeData} />;
      case "templates":
        return <TemplatesTab />;
      case "automation":
        return <AutomationSection jobs={jobs} resumeData={resumeData} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <h2 className="text-4xl font-display font-bold text-white mb-4 tracking-tight">
              Section Under Development
            </h2>
            <p className="text-text-secondary max-w-md mx-auto">
              We are currently building the {activeTab.replace("-", " ")} module. Stay tuned for futuristic updates.
            </p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-6 right-6 z-[80] p-3 rounded-xl bg-accent text-white shadow-lg shadow-accent/20"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className={`transition-all duration-300 ${isSidebarOpen ? "blur-sm lg:blur-none" : ""} lg:pl-72 pt-8 min-h-screen`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-[65] bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Global Grainy Noise Overlay */}
      <div className="noise-bg" />
    </div>
  );
}
