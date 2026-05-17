"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Lines of text to simulate terminal output
const LINES = [
  { t: 0,   color: "#8888aa", text: "$ npm run dev" },
  { t: 0.3, color: "#f0f0f8", text: "▶  loophire@1.0.0 dev" },
  { t: 0.6, color: "#8888aa", text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" },
  { t: 0.9, color: "#f0f0f8", text: "  LoopHire — AI-Powered Hiring" },
  { t: 1.2, color: "#8888aa", text: "  Model: advanced-neural-matching" },
  { t: 1.5, color: "#eab308", text: "  Found 5 matching job(s)" },
  { t: 1.8, color: "#f0f0f8", text: "" },
  { t: 2.0, color: "#3b82f6", text: "  Processing: Acme Corp → Senior Product Designer" },
  { t: 2.3, color: "#8888aa", text: "  Analyzing job requirements..." },
  { t: 2.6, color: "#f0f0f8", text: "  Matching profile strengths (94% confidence)" },
  { t: 2.9, color: "#8888aa", text: "  Generating personalized outreach..." },
  { t: 3.4, color: "#22c55e", text: '  Subject: "Product Designer Application — LoopHire"' },
  { t: 3.7, color: "#f0f0f8", text: "  Preparing application documents..." },
  { t: 4.0, color: "#ff6640", text: "" },
  { t: 4.1, color: "#ff6640", text: "  ════════════════════════════════" },
  { t: 4.2, color: "#ff6640", text: "  📋 REVIEW — Acme Corp · Designer" },
  { t: 4.3, color: "#ff6640", text: "  ════════════════════════════════" },
  { t: 4.5, color: "#f0f0f8", text: "  Dear Acme team, I noticed your opening..." },
  { t: 4.6, color: "#f0f0f8", text: "  [Tailored message based on your portfolio]" },
  { t: 4.9, color: "#f0f0f8", text: "" },
  { t: 5.0, color: "#eab308", text: "  Proceed with application? [y]es / [s]kip / [n]o: y" },
  { t: 5.5, color: "#22c55e", text: "  ✓ Application submitted successfully!" },
  { t: 5.8, color: "#22c55e", text: "  ✓ Dashboard updated → /dashboard" },
  { t: 6.1, color: "#8888aa", text: "  Total: 5  |  Applied: 1  |  Pending: 4" },
];

/**
 * Animated terminal demonstration of the platform's workflow
 */
export default function TerminalDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="demo" ref={ref} className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={inView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.7 }} 
          className="text-center mb-12"
        >
          <p className="text-xs font-medium tracking-widest mb-4" style={{ color: "var(--accent)" }}>
            LIVE DEMO
          </p>
          <h2 className="font-display text-5xl md:text-6xl" style={{ color: "var(--text-primary)" }}>
            Watch it <span className="gradient-text italic">run.</span>
          </h2>
        </motion.div>

        {/* Terminal Window Visualization */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.97 }} 
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-2xl overflow-hidden"
          style={{ 
            border: "1px solid var(--border-bright)", 
            background: "#0d0d14", 
            boxShadow: "0 40px 100px rgba(0,0,0,0.5)" 
          }}
        >
          {/* Window Control Buttons and Title */}
          <div 
            className="flex items-center gap-2 px-5 py-4" 
            style={{ background: "#111118", borderBottom: "1px solid var(--border)" }}
          >
            <div className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
            <div className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
            <span 
              className="ml-4 text-xs" 
              style={{ color: "var(--text-muted)", fontFamily: "monospace" }}
            >
              zsh — loophire
            </span>
          </div>

          {/* Terminal Content Area */}
          <div className="p-6 font-mono text-sm leading-7 min-h-[420px]">
            {LINES.map((line, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: line.t * 0.5 + 0.4 }}
                style={{ color: line.color, minHeight: "1.75rem" }}
              >
                {line.text}
              </motion.div>
            ))}
            {/* Blinking cursor */}
            <motion.span
              animate={{ opacity: [1, 0, 1] }} 
              transition={{ duration: 1, repeat: Infinity }}
              style={{ 
                color: "var(--accent)", 
                display: "inline-block", 
                width: 8, 
                height: 18, 
                background: "var(--accent)", 
                borderRadius: 1, 
                verticalAlign: "middle" 
              }} 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
