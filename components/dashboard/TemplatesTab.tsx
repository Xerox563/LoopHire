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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Outreach Templates</h1>
        <p className="text-text-secondary text-sm mt-1">High-conversion frameworks for your AI automation engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {OUTREACH_TEMPLATES.map((template) => {
          const Icon = template.icon;
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card !p-8 flex flex-col h-full group hover:border-accent/20 transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${template.color}10`, borderColor: `${template.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: template.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{template.title}</h3>
                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest">{template.subtitle}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleCopy(template.id, template.content)}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-text-muted hover:text-white transition-all"
                >
                  {copiedId === template.id ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex-1 p-6 rounded-2xl bg-white/[0.02] border border-white/5 font-mono text-xs text-text-secondary leading-relaxed whitespace-pre-wrap relative overflow-hidden">
                {template.content}
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Compatible with Neural Engine</span>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-widest hover:underline">
                  <Edit3 className="w-3.5 h-3.5" />
                  Customize Framework
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
