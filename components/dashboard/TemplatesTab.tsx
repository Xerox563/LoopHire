"use client";

import { motion } from "framer-motion";
import { 
  Layers, 
  Zap, 
  Target, 
  Rocket, 
  Briefcase,
  Copy,
  Check,
  Edit3
} from "lucide-react";
import { useState } from "react";

export const OUTREACH_TEMPLATES = [
  {
    id: "startup",
    title: "Problem-First",
    subtitle: "Best for startups & YC companies",
    icon: Rocket,
    color: "#ff6640",
    content: `Hi [Name],

I've been following [Company] because [specific insight about their problem/mission]. It matters because [why this problem is hard].

I've spent [X years] building [specific domain: systems/infrastructure/products], and I've shipped [concrete example: scaled X to handle Y, optimized Z, designed W]. That's the foundation this problem needs.

I'd like to explore how I could contribute to [their specific goal/problem]. I move fast and care about shipping quality work.

Let me know what makes sense.
[Your name]`
  },
  {
    id: "established",
    title: "Value-Focused",
    subtitle: "Best for established companies",
    icon: Briefcase,
    color: "#3b82f6",
    content: `Hi [Name],

I'm interested in [specific role] at [Company] because [why their team/work resonates with you].

In my [X years] working on [domain], I've:

[Concrete achievement with numbers/impact]
[Concrete achievement with numbers/impact]
[Concrete achievement with numbers/impact]

I'm looking for a role where I can [your specific goal], and [Company]'s work on [specific project/problem] aligns exactly with that.

I'd love to chat more about how I could add value to your team.
[Your name]`
  },
  {
    id: "direct",
    title: "Direct & Confident",
    subtitle: "Best when you're a strong fit",
    icon: Zap,
    color: "#10b981",
    content: `Hi [Name],

I'm a [role] with [X years] building [domain]. I've [one powerful achievement]. That's the kind of work where I thrive—shipping fast, solving hard problems, obsessing over quality.

[Company]'s approach to [specific thing they do] caught my attention because [specific insight]. I want to be part of that.

Let's talk.
[Your name]`
  },
  {
    id: "founder",
    title: "Founder / Early Stage",
    subtitle: "Direct, scrappy tone",
    icon: Target,
    color: "#8b5cf6",
    content: `Hi [Name],

Building [Company] is solving [specific problem], and I get why it matters. I've spent [X years] doing [relevant work], and I know what it takes to ship this kind of thing.

You're at the stage where [insight about their current challenge]. I've been through that exact phase [reference your relevant experience].

I'm genuinely interested in exploring this. What does your hiring look like right now?
[Your name]`
  },
  {
    id: "insight",
    title: "Insight-Driven",
    subtitle: "Deeply personalized philosophy",
    icon: Layers,
    color: "#ec4899",
    content: `Hi [Company] team,

I’ve been watching what you’re building because the insight is spot-on: [their core problem/insight that matters].

I’ve spent [X years/months] doing the opposite—building systems that are [your core philosophy/previous state]. I [specific concrete achievement with impact], [another specific achievement], and [third achievement]. That's the foundation this problem needs.

Your mission resonates because I think the same way: [their core value] isn’t a feature—it’s foundational. It frees teams to focus on what matters.

I’d like to explore how I could contribute to this, whether that’s [specific role/project area/team]. I’m ready to move quickly.

What would make sense to discuss?
[Your name]`
  }
];

export default function TemplatesTab() {
  const [activeId, setActiveId] = useState(OUTREACH_TEMPLATES[0].id);
  const [copied, setCopied] = useState(false);

  const activeTemplate = OUTREACH_TEMPLATES.find(t => t.id === activeId)!;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTemplate.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 lg:space-y-10 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-display font-bold text-white tracking-tight text-center lg:text-left">Outreach Protocols</h2>
          <p className="text-text-secondary text-sm mt-1 text-center lg:text-left">Select a template philosophy for your AI-generated messages.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl self-center lg:self-auto">
          <button className="px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-accent rounded-lg shadow-lg shadow-accent/20 transition-all">Templates</button>
          <button className="px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-white transition-all">Custom</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Template Selector */}
        <div className="lg:col-span-4 space-y-4">
          {OUTREACH_TEMPLATES.map((t) => {
            const Icon = t.icon;
            const isActive = activeId === t.id;
            return (
              <motion.div
                key={t.id}
                onClick={() => setActiveId(t.id)}
                whileHover={{ x: 4 }}
                className={`glass-card !p-4 cursor-pointer transition-all duration-300 ${
                  isActive ? 'border-accent/40 bg-accent/[0.03] ring-1 ring-accent/20' : 'hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    isActive ? 'bg-accent text-white scale-110 shadow-lg shadow-accent/20' : 'bg-white/5 text-text-muted'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold tracking-tight text-white">
                      {t.title}
                    </h4>
                    <p className="text-[10px] text-text-muted truncate uppercase tracking-widest font-medium mt-0.5">{t.subtitle}</p>
                  </div>
                  {isActive && <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-accent" />}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Template Preview */}
        <div className="lg:col-span-8">
          <div className="glass-card h-full flex flex-col !p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-error/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-warning/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-success/40" />
                </div>
                <div className="h-4 w-px bg-white/10 mx-2" />
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Neural Output Preview</span>
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-white hover:bg-white/10 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy Source"}
              </button>
            </div>
            
            <div className="flex-1 p-6 lg:p-10 font-mono text-sm leading-relaxed text-text-secondary whitespace-pre-wrap overflow-y-auto bg-black/20">
              {activeTemplate.content}
            </div>

            <div className="px-6 lg:px-10 py-6 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">AI will fill [placeholders] using your profile.</p>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-accent/20 w-full sm:w-auto justify-center">
                <Edit3 className="w-4 h-4" />
                Customize Logic
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
