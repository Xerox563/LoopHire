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
  Zap
} from "lucide-react";
import { useState } from "react";

const MESSAGE_TYPES = [
  { id: "linkedin", label: "LinkedIn Outreach", icon: MessageSquare, color: "#0077b5" },
  { id: "email", label: "Email Application", icon: Mail, color: "#ea4335" },
  { id: "follow-up", label: "Follow-up Message", icon: RefreshCw, color: "#10b981" },
  { id: "referral", label: "Referral Request", icon: Send, color: "#ff6640" },
];

export default function AIMessagesTab() {
  const [activeType, setActiveType] = useState("linkedin");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">AI Messages</h1>
          <p className="text-text-secondary text-sm mt-1">Generate and manage high-conversion outreach content.</p>
        </div>
        <button className="btn-cinematic !py-2.5 !px-5 !rounded-xl flex items-center gap-2 text-xs">
          <Plus className="w-4 h-4" />
          New Draft
        </button>
      </div>

      {/* Message Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {MESSAGE_TYPES.map((type) => {
          const Icon = type.icon;
          const isActive = activeType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`p-6 rounded-2xl border transition-all flex flex-col items-center text-center gap-4 ${
                isActive 
                  ? "bg-white/[0.05] border-accent/40 shadow-lg shadow-accent/5" 
                  : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
              }`}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${type.color}10`, border: `1px solid ${type.color}20` }}
              >
                <Icon className="w-6 h-6" style={{ color: type.color }} />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest ${isActive ? "text-white" : "text-text-muted"}`}>
                  {type.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card !p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">AI Content Generator</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-text-muted hover:text-white transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-text-muted hover:text-white transition-all">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 font-mono text-sm text-text-secondary leading-relaxed min-h-[300px]">
                <p className="mb-4">Hi [Recruiter Name],</p>
                <p className="mb-4">I recently applied for the <span className="text-white font-bold">Software Engineer</span> role at <span className="text-white font-bold">Airbnb</span> and wanted to reach out personally. My background in building high-scale distributed systems and my experience with React/Node.js align closely with the requirements you've listed.</p>
                <p className="mb-4">In my previous role, I reduced system latency by 40% which seems relevant to the performance goals mentioned in the job description. I've attached my portfolio and would love to discuss how I can contribute to the Airbnb team.</p>
                <p>Best regards,<br />Rohit</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Model:</span>
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">DeepSeek-Chat-V3</span>
              </div>
              <button className="btn-cinematic !py-3 !px-8 !rounded-xl text-xs">
                Refine with AI
              </button>
            </div>
          </div>
        </div>

        {/* Recent Drafts Sidebar */}
        <div className="space-y-6">
          <div className="glass-card !p-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Recent Drafts</h3>
            <div className="space-y-4">
              {[
                { company: "Notion", type: "LinkedIn", time: "10m ago" },
                { company: "Stripe", type: "Email", time: "1h ago" },
                { company: "Ramp", type: "Follow-up", time: "3h ago" },
                { company: "OpenAI", type: "Referral", time: "5h ago" },
              ].map((draft, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-white group-hover:text-accent transition-colors">{draft.company}</p>
                    <span className="text-[10px] text-text-muted">{draft.time}</span>
                  </div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{draft.type}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card !p-8 bg-accent/5 border-accent/20">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">AI Tip</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Personalized messages have a <span className="text-white font-bold">3x higher</span> response rate than generic templates. Use the "Refine" tool to add specific project details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
