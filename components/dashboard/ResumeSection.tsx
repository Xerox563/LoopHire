"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Check, Edit2, Save, X } from "lucide-react";

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
        setData(parsed);
        setTempData(parsed);
        onUpdate(parsed);
      } else {
        try {
          const err = await response.json();
          console.error("Server error:", err.error || "Unknown server error");
        } catch (e) {
          console.error("Server returned non-JSON error:", response.status, response.statusText);
        }
      }
    } catch (error) {
      console.error("Error parsing resume:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    setData(tempData);
    onUpdate(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(data);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-accent" />
          Resume Management
        </h2>
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-white transition-all"
            >
              <Edit2 className="w-4 h-4" />
              Edit Sections
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/20 border border-success/30 text-success hover:bg-success/30 transition-all"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div 
        className="p-8 rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center text-center group hover:border-accent/50 transition-all cursor-pointer relative"
        onClick={() => document.getElementById("resume-upload")?.click()}
      >
        <input 
          id="resume-upload"
          type="file" 
          className="hidden" 
          accept=".txt,.md,.pdf"
          onChange={handleFileUpload}
        />
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
          <Upload className="w-8 h-8 text-text-muted group-hover:text-accent transition-colors" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          {isUploading ? "Analyzing Resume..." : "Upload New Resume"}
        </h3>
        <p className="text-sm text-text-muted max-w-xs">
          {isUploading ? "Our AI is extracting experience and skills..." : "Drag and drop your resume or click to browse (PDF, TXT, MD)"}
        </p>
        
        {isUploading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-bold text-white uppercase tracking-widest">Processing...</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard 
          title="Experience" 
          value={isEditing ? tempData.experience : data.experience}
          isEditing={isEditing}
          onChange={(v) => setTempData({...tempData, experience: v})}
          placeholder="Detailed work history and achievements..."
        />
        <SectionCard 
          title="Technical Skills" 
          value={isEditing ? tempData.technicalSkills : data.technicalSkills}
          isEditing={isEditing}
          onChange={(v) => setTempData({...tempData, technicalSkills: v})}
          placeholder="Languages, frameworks, tools..."
        />
        <SectionCard 
          title="Education" 
          value={isEditing ? tempData.education : data.education}
          isEditing={isEditing}
          onChange={(v) => setTempData({...tempData, education: v})}
          placeholder="Degrees, certifications, relevant coursework..."
        />
        <SectionCard 
          title="Projects" 
          value={isEditing ? tempData.projects : data.projects}
          isEditing={isEditing}
          onChange={(v) => setTempData({...tempData, projects: v})}
          placeholder="Key projects and your contributions..."
        />
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
      layout
      className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          {title}
        </h4>
        {value && !isEditing && <Check className="w-4 h-4 text-success" />}
      </div>
      
      {isEditing ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-accent/50 transition-all resize-none"
        />
      ) : (
        <div className="text-sm text-text-secondary line-clamp-6 leading-relaxed">
          {value || <span className="italic text-text-muted">No data extracted yet. Upload your resume to begin.</span>}
        </div>
      )}
    </motion.div>
  );
}
