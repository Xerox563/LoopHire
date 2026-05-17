"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// The process steps for using LoopHire
const STEPS = [
  {
    n: "01",
    icon: "📋",
    title: "Upload your Profile",
    desc: "Simply upload your resume and fill in your preferences. Our AI will understand your background and career goals.",
    detail: "AI-powered profile analysis",
  },
  {
    n: "02",
    icon: "🤖",
    title: "AI Finds Matches",
    desc: "LoopHire scans thousands of job listings to find the ones that perfectly match your skills and experience level.",
    detail: "Real-time job discovery",
  },
  {
    n: "03",
    icon: "🖱️",
    title: "One-Click Apply",
    desc: "Our automation handles the repetitive parts of the application process, ensuring everything is filled out correctly.",
    detail: "Seamless application flow",
  },
  {
    n: "04",
    icon: "⏸️",
    title: "Track Your Success",
    desc: "Monitor your application status and get insights into your progress through our centralized dashboard.",
    detail: "Comprehensive tracking tools",
  },
];

/**
 * How It Works section with a vertical timeline
 */
export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how" ref={ref} className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={inView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.7 }} 
          className="text-center mb-20"
        >
          <p className="text-xs font-medium tracking-widest mb-4" style={{ color: "var(--accent)" }}>
            HOW IT WORKS
          </p>
          <h2 className="font-display text-5xl md:text-6xl" style={{ color: "var(--text-primary)" }}>
            Four steps.<br />
            <span className="gradient-text italic">Zero tedium.</span>
          </h2>
        </motion.div>

        {/* Steps — vertical timeline visualization */}
        <div className="relative">
          {/* Vertical central line */}
          <div 
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px" 
            style={{ 
              background: "linear-gradient(to bottom, transparent, var(--border), var(--border-bright), var(--border), transparent)" 
            }} 
          />

          {STEPS.map((step, i) => (
            <motion.div 
              key={step.n}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className={`relative flex gap-8 mb-16 md:mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row items-start`}
            >
              {/* Icon and Step Number bubble */}
              <div 
                className="relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border-bright)" }}
              >
                {step.icon}
                <div 
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  {i + 1}
                </div>
              </div>

              {/* Step Content Card */}
              <motion.div 
                whileHover={{ y: -4 }} 
                transition={{ duration: 0.2 }}
                className="card-glass rounded-2xl p-6 flex-1 max-w-md"
                style={{ background: "var(--surface)" }}
              >
                <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
                  STEP {step.n}
                </p>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                  {step.desc}
                </p>
                <span 
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
                  style={{ 
                    background: "rgba(255,102,64,0.08)", 
                    color: "var(--accent)", 
                    border: "1px solid rgba(255,102,64,0.15)" 
                  }}
                >
                  ✦ {step.detail}
                </span>
              </motion.div>

              {/* Layout spacer for alternating desktop view */}
              <div className="hidden md:block flex-1 max-w-md" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
