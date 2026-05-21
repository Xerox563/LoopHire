"use client";

import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Mail, 
  Send, 
  Copy, 
  RefreshCw, 
  Check,
  Search,
  Plus,
  Zap,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import OpenAI from "openai";

const getOpenAIClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing API Key: Please set NEXT_PUBLIC_OPENROUTER_API_KEY in your environment.");
  }
  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    dangerouslyAllowBrowser: true
  });
};

import { OUTREACH_TEMPLATES } from "./TemplatesTab";

export default function AIMessagesTab() {
  const [activeType, setActiveType] = useState("linkedin");
  const [activeTemplateId, setActiveTemplateId] = useState("startup");
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState("Select a job or prompt AI to generate a message...");
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetJob, setTargetJob] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    async function loadJobs() {
      const { data } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
      if (data) setJobs(data);
    }
    loadJobs();
  }, []);

  const generateMessage = async () => {
    if (!targetJob) {
      alert("Please select a job first");
      return;
    }
    setIsGenerating(true);
    try {
      const job = jobs.find(j => j.id === targetJob);
      const { data: profile } = await supabase.from("user_profile").select("*").single();
      
      const selectedTemplate = OUTREACH_TEMPLATES.find(t => t.id === activeTemplateId);
      
      const prompt = `Generate a high-conversion job outreach message.
      
      BASE TEMPLATE STYLE to follow strictly:
      ${selectedTemplate?.content}

      TARGET JOB:
      Role: ${job.role}
      Company: ${job.company}
      Job Details: ${job.notes || "Not provided"}

      CANDIDATE PROFILE (Use this to fill [X years], [domain], [achievements], etc.):
      Full Name: ${profile?.first_name} ${profile?.last_name}
      Experience Summary: ${profile?.experience || "General Software Engineer"}
      Skills: ${profile?.technical_skills || "Not provided"}

      INSTRUCTIONS:
      1. Follow the template structure exactly.
      2. Replace all placeholders (like [Name], [X years], [concrete achievement]) with real data from the candidate profile or the job.
      3. Keep the tone ${selectedTemplate?.title === 'Founder / Early Stage' ? 'direct and scrappy' : 'professional and high-impact'}.
      4. DO NOT include any meta-text, just the final message.`;

      const client = getOpenAIClient();
      const response = await client.chat.completions.create({
        model: "deepseek/deepseek-chat",
        messages: [{ role: "user", content: prompt }],
      });

      setContent(response.choices[0].message.content || "Failed to generate.");
    } catch (err) {
      console.error(err);
      setContent("Error generating message. Check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">AI Messages</h1>
          <p className="text-text-secondary text-sm mt-1">Generate and manage high-conversion outreach content.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Target Job</label>
          <select 
            value={targetJob}
            onChange={(e) => setTargetJob(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-accent/30 transition-all"
          >
            <option value="">Select a job from your queue</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.role} at {job.company}</option>
            ))}
          </select>
        </div>
        <div className="lg:col-span-2 space-y-2">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Select Strategy Template</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {OUTREACH_TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => setActiveTemplateId(template.id)}
                className={`py-3 px-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                  activeTemplateId === template.id ? "bg-accent/10 border-accent/40 text-white shadow-lg shadow-accent/5" : "bg-white/5 border-white/10 text-text-muted hover:text-white"
                }`}
              >
                {template.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card !p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isGenerating ? "bg-accent animate-pulse" : "bg-success"}`} />
                <span className="text-xs font-bold text-white uppercase tracking-widest">
                  {isGenerating ? "AI is thinking..." : "Ready to Generate"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-text-muted hover:text-white transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-6 rounded-2xl bg-white/[0.03] border border-white/5 font-mono text-sm text-text-secondary leading-relaxed min-h-[350px] focus:outline-none focus:border-accent/20 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Model:</span>
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">DeepSeek-V3</span>
              </div>
              <button 
                onClick={generateMessage}
                disabled={isGenerating || !targetJob}
                className="btn-cinematic !py-3 !px-8 !rounded-xl text-xs disabled:opacity-50"
              >
                {isGenerating ? "Generating..." : "Generate with AI"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card !p-8 bg-accent/5 border-accent/20">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Outreach Tip</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Mentioning a specific project or achievement from your resume increases response rates by <span className="text-white font-bold">45%</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
