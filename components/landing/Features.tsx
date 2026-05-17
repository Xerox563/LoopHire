"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// List of features to highlight
const FEATURES = [
  { 
    icon: "🧠", 
    title: "AI-Powered Matching", 
    desc: "Our smart matching engine analyzes your profile and job requirements to find the perfect fit for you." 
  },
  { 
    icon: "⚡", 
    title: "Instant Applications", 
    desc: "Apply to multiple positions with just a few clicks. Save time on repetitive data entry." 
  },
  { 
    icon: "📊", 
    title: "Progress Tracking", 
    desc: "Keep tabs on all your applications in one centralized dashboard. Know exactly where you stand." 
  },
  { 
    icon: "🔐", 
    title: "Secure & Private", 
    desc: "Your data is encrypted and handled with care. We prioritize your privacy and security." 
  },
  { 
    icon: "🎯", 
    title: "Targeted Outreach", 
    desc: "Craft personalized messages for each application to increase your chances of getting noticed." 
  },
  { 
    icon: "📸", 
    title: "Visual History", 
    desc: "Maintain a visual record of your applications and communications for easy reference." 
  },
  { 
    icon: "⏸️", 
    title: "Full Control", 
    desc: "Review every application before it's sent. You stay in the driver's seat at all times." 
  },
  { 
    icon: "🚀", 
    title: "Modern Tech Stack", 
    desc: "Built with the latest technologies like Next.js and Tailwind CSS for a smooth, fast experience." 
  },
];

/**
 * Features section showcasing the platform's capabilities
 */
export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" ref={ref} className="py-32 px-6 relative">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, var(--accent), transparent)" }} 
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={inView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.7 }} 
          className="text-center mb-16"
        >
          <p className="text-xs font-medium tracking-widest mb-4" style={{ color: "var(--accent)" }}>
            FEATURES
          </p>
          <h2 className="font-display text-5xl md:text-6xl" style={{ color: "var(--text-primary)" }}>
            Everything you need.<br />
            <span className="gradient-text italic">Nothing you don't.</span>
          </h2>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div 
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -6, borderColor: "rgba(255,102,64,0.3)" }}
              className="p-6 rounded-2xl cursor-default transition-colors"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-base mb-2" style={{ color: "var(--text-primary)" }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
