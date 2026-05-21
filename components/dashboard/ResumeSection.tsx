"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Check, Edit2, Save, X, Loader2 } from "lucide-react";
import PersonalInfoSection from "@/components/dashboard/PersonalInfoSection";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

interface ResumeSectionProps {
  onUpdate: (data: ResumeData) => void;
  initialData?: ResumeData;
}

export interface ResumeData {
  experience: string;
  technicalSkills: string;
  education: string;
  projects: string;
}

export default function ResumeSection({ onUpdate, initialData }: ResumeSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<ResumeData>(initialData || {
    experience: "",
    technicalSkills: "",
    education: "",
    projects: "",
  });
  const [tempData, setTempData] = useState<ResumeData>(data);
  const [isLoading, setIsLoading] = useState(true);

  // Load resume from Supabase on mount
  useEffect(() => {
    async function loadResume() {
      try {
        const { data: resume, error } = await supabase
          .from("resume")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();

        if (resume) {
          const loadedData = {
            experience: resume.experience,
            technicalSkills: resume.technical_skills,
            education: resume.education,
            projects: resume.projects,
          };
          setData(loadedData);
          setTempData(loadedData);
          onUpdate(loadedData);
        }
      } catch (err) {
        console.error("Failed to load resume from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadResume();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
          const parsed = await response.json();
          
          // Save to Supabase via server-side proxy
          const dbResponse = await fetch("/api/db", {
            method: "POST",
            body: JSON.stringify({
              table: "resume",
              action: "insert",
              data: {
                experience: parsed.experience,
                technical_skills: parsed.technicalSkills,
                education: parsed.education,
                projects: parsed.projects,
              }
            })
          });

          if (!dbResponse.ok) {
            const dbError = await dbResponse.json();
            console.error("Supabase error:", dbError);
          }

          // Also update user_profile with resume path via server-side proxy
          const profileResponse = await fetch("/api/db", {
            method: "POST",
            body: JSON.stringify({
              table: "user_profile",
              action: "insert",
              data: {
                resume_file_path: parsed.filePath
              }
            })
          });

          if (!profileResponse.ok) {
            const profileError = await profileResponse.json();
            console.error("Profile error:", profileError);
          }

          setData(parsed);
          setTempData(parsed);
          onUpdate(parsed);
        } else {
        try {
          const err = await response.json();
          const errorMsg = err.details 
            ? `${err.error}: ${err.details}` 
            : (err.error || "Unknown server error");
          console.error("Server error:", errorMsg);
          alert(`Error: ${errorMsg}`); // Show alert for immediate feedback
        } catch (e) {
          console.error("Server returned non-JSON error:", response.status, response.statusText);
          alert(`Server Error (${response.status}): ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error("Error parsing resume:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    // Update in Supabase via server-side proxy
    const response = await fetch("/api/db", {
      method: "POST",
      body: JSON.stringify({
        table: "resume",
        action: "insert",
        data: {
          experience: tempData.experience,
          technical_skills: tempData.technicalSkills,
          education: tempData.education,
          projects: tempData.projects,
        }
      })
    });

    if (!response.ok) {
      const dbError = await response.json();
      console.error("Supabase error:", dbError);
      alert("Failed to save changes to database");
      return;
    }

    setData(tempData);
    onUpdate(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(data);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <span className="text-text-muted font-bold uppercase tracking-widest">Loading Profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Personal Info Section */}
      <PersonalInfoSection />

      <div className="h-px bg-white/5" />

      {/* Resume Management Section */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 shadow-lg shadow-accent/10">
              <FileText className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight">Resume Profile</h2>
              <p className="text-xs text-text-muted uppercase tracking-[0.2em] font-bold">Document Parsing & Intelligence</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-white hover:bg-white/10 transition-all"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-success/20 border border-success/30 text-xs font-bold uppercase tracking-widest text-success hover:bg-success/30 transition-all shadow-lg shadow-success/10"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div 
          className="p-12 rounded-[2.5rem] border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center text-center group hover:border-accent/50 hover:bg-accent/[0.02] transition-all duration-500 cursor-pointer relative overflow-hidden"
          onClick={() => document.getElementById("resume-upload")?.click()}
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl" />
          
          <input 
            id="resume-upload"
            type="file" 
            className="hidden" 
            accept=".txt,.md,.pdf"
            onChange={handleFileUpload}
          />
          
          <div className="relative z-10 w-20 h-20 rounded-[2rem] bg-surface-2 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
            <Upload className="w-10 h-10 text-text-muted group-hover:text-accent transition-colors duration-500" />
          </div>
          
          <div className="relative z-10 space-y-2">
            <h3 className="text-2xl font-display font-bold text-white tracking-tight">
              {isUploading ? "Neural Parsing Active..." : "Update Master Resume"}
            </h3>
            <p className="text-text-secondary text-sm max-w-sm mx-auto leading-relaxed">
              {isUploading 
                ? "Our AI is extracting structured intelligence from your document." 
                : "Drop your PDF, TXT, or MD file here to sync with the automation engine."}
            </p>
          </div>
          
          {isUploading && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-xl z-20 flex items-center justify-center">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-accent/20 rounded-full" />
                  <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_20px_rgba(255,102,64,0.4)]" />
                </div>
                <div className="space-y-1 text-center">
                  <span className="text-lg font-display font-bold text-white block">Extracting Data</span>
                  <span className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] animate-pulse">Syncing with LLM</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SectionCard 
            title="Professional Experience" 
            value={isEditing ? tempData.experience : data.experience}
            isEditing={isEditing}
            onChange={(v) => setTempData({...tempData, experience: v})}
            placeholder="Detailed work history and achievements..."
          />
          <SectionCard 
            title="Technical Arsenal" 
            value={isEditing ? tempData.technicalSkills : data.technicalSkills}
            isEditing={isEditing}
            onChange={(v) => setTempData({...tempData, technicalSkills: v})}
            placeholder="Languages, frameworks, tools..."
          />
          <SectionCard 
            title="Academic Background" 
            value={isEditing ? tempData.education : data.education}
            isEditing={isEditing}
            onChange={(v) => setTempData({...tempData, education: v})}
            placeholder="Degrees, certifications, relevant coursework..."
          />
          <SectionCard 
            title="Strategic Projects" 
            value={isEditing ? tempData.projects : data.projects}
            isEditing={isEditing}
            onChange={(v) => setTempData({...tempData, projects: v})}
            placeholder="Personal or professional projects..."
          />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, value, isEditing, onChange, placeholder }: {
  title: string;
  value: string;
  isEditing: boolean;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card flex flex-col h-full min-h-[300px]"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_10px_#ff6640]" />
        <h3 className="text-lg font-display font-bold text-white tracking-tight">{title}</h3>
      </div>
      
      {isEditing ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-sm text-text-secondary leading-relaxed focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all resize-none"
        />
      ) : (
        <div className="flex-1 p-6 rounded-2xl bg-white/[0.01] border border-white/5 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap italic opacity-80">
          {value || <span className="opacity-30">No data available for this section.</span>}
        </div>
      )}
    </motion.div>
  )}
