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
        const response = await fetch("/api/db", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "resume",
            action: "select",
            data: "*"
          })
        });

        if (response.ok) {
          const { data: resumeList } = await response.json();
          const resume = Array.isArray(resumeList) ? resumeList.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0] : null;

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
    <div className="space-y-6 lg:space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-display font-bold text-white tracking-tight text-center lg:text-left">Candidate Dossier</h2>
          <p className="text-text-secondary text-sm mt-1 text-center lg:text-left">Your professional background and technical identity.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => document.getElementById("resume-upload")?.click()}
            disabled={isUploading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-text-secondary text-sm font-bold hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {isUploading ? "Analyzing..." : "Update Resume"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-10">
        {/* Personal Details - Full Width on smaller screens */}
        <div className="xl:col-span-1">
          <PersonalInfoSection />
        </div>

        {/* Experience & Skills - Main Column */}
        <div className="xl:col-span-2 space-y-6 lg:space-y-10">
          <div className="glass-card relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Neural Intelligence Profile</h3>
              </div>
              
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
                  isEditing ? "bg-success text-white shadow-lg shadow-success/20" : "bg-white/5 text-text-muted hover:text-white hover:bg-white/10"
                }`}
              >
                {isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
                {isEditing ? "Save Profile" : "Edit Details"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Experience Framework</label>
                {isEditing ? (
                  <textarea
                    value={tempData.experience}
                    onChange={(e) => setTempData({ ...tempData, experience: e.target.value })}
                    className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-accent/30 transition-all font-mono"
                  />
                ) : (
                  <div className="w-full h-48 bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-text-secondary overflow-y-auto leading-relaxed custom-scrollbar">
                    {data.experience || "No experience data provided."}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Technical Stack</label>
                {isEditing ? (
                  <textarea
                    value={tempData.technicalSkills}
                    onChange={(e) => setTempData({ ...tempData, technicalSkills: e.target.value })}
                    className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-accent/30 transition-all font-mono"
                  />
                ) : (
                  <div className="w-full h-48 bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-text-secondary overflow-y-auto leading-relaxed custom-scrollbar">
                    {data.technicalSkills || "No skills data provided."}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Academic Background</label>
                {isEditing ? (
                  <textarea
                    value={tempData.education}
                    onChange={(e) => setTempData({ ...tempData, education: e.target.value })}
                    className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-accent/30 transition-all font-mono"
                  />
                ) : (
                  <div className="w-full h-48 bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-text-secondary overflow-y-auto leading-relaxed custom-scrollbar">
                    {data.education || "No education data provided."}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Neural Projects</label>
                {isEditing ? (
                  <textarea
                    value={tempData.projects}
                    onChange={(e) => setTempData({ ...tempData, projects: e.target.value })}
                    className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-accent/30 transition-all font-mono"
                  />
                ) : (
                  <div className="w-full h-48 bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-text-secondary overflow-y-auto leading-relaxed custom-scrollbar">
                    {data.projects || "No project data provided."}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 pt-8 border-t border-white/5 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setTempData(data);
                  }}
                  className="px-6 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest text-text-muted hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2.5 rounded-lg bg-accent text-white text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-[1.02] transition-all"
                >
                  Confirm Changes
                </button>
              </div>
            )}
          </div>
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
