"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Edit3, Cpu, TrendingUp } from "lucide-react";

// Lines of text to simulate terminal output
const LINES = [
  { t: 0,   color: "#ff6640", text: "$ loophire run" },
  { t: 0.3, color: "#8888aa", text: "Initializing AI agent..." },
  { t: 0.6, color: "#8888aa", text: "Loading your resume..." },
  { t: 0.9, color: "#22c55e", text: "Fetching job links (28)..." },
  { t: 1.2, color: "#8888aa", text: "" },
  { t: 1.5, color: "#3b82f6", text: "Visiting: careers.google.com/jobs/12345" },
  { t: 1.8, color: "#8888aa", text: "Extracting job details..." },
  { t: 2.1, color: "#8888aa", text: "Generating personalized message..." },
  { t: 2.4, color: "#8888aa", text: "Filling application form..." },
  { t: 2.7, color: "#22c55e", text: "Application submitted successfully ✅" },
  { t: 3.0, color: "#8888aa", text: "" },
  { t: 3.3, color: "#ff4081", text: "Visiting: airbnb.com/careers/98765" },
  { t: 3.6, color: "#8888aa", text: "Extracting job details..." },
  { t: 3.9, color: "#8888aa", text: "Generating personalized message..." },
  { t: 4.2, color: "#8888aa", text: "Filling application form..." },
  { t: 4.5, color: "#22c55e", text: "Application submitted successfully ✅" },
  { t: 4.8, color: "#8888aa", text: "" },
  { t: 5.1, color: "#00bcd4", text: "Visiting: stripe.com/jobs/54321" },
  { t: 5.4, color: "#8888aa", text: "Extracting job details..." },
  { t: 5.7, color: "#8888aa", text: "Generating personalized message..." },
  { t: 6.0, color: "#8888aa", text: "Filling application form..." },
  { t: 6.3, color: "#22c55e", text: "Application submitted successfully ✅" },
  { t: 6.6, color: "#8888aa", text: "" },
  { t: 6.9, color: "#f0f0f8", text: "All tasks completed. You can relax now. ☕" },
  { t: 7.2, color: "#22c55e", text: "Total applications sent: 28" },
  { t: 7.5, color: "#22c55e", text: "Success rate: 100%" },
];

/**
 * Animated terminal demonstration of the platform's workflow
 */
export default function TerminalDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="demo" ref={ref} className="py-32 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={inView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.7 }} 
          className="text-center mb-24"
        >
          <p className="text-[10px] font-bold tracking-[0.3em] mb-4 text-accent uppercase">
            SEE LOOPHIRE IN ACTION
          </p>
          <h2 className="font-display text-5xl md:text-7xl font-bold text-white tracking-tight">
            Watch it <span className="accent-gradient italic">run.</span>
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Terminal Window Visualization */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={inView ? { opacity: 1, x: 0 } : {}} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-3/5 rounded-2xl overflow-hidden border border-white/10 bg-[#050505] shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative group"
          >
            {/* Window Control Buttons and Title */}
            <div className="flex items-center gap-2 px-6 py-4 bg-white/[0.02] border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-error/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-warning/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-success/40" />
              </div>
              <div className="h-4 w-px bg-white/10 mx-4" />
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                terminal — neural-engine
              </span>
            </div>

            {/* Terminal Content Area */}
            <div className="p-8 font-mono text-xs md:text-sm leading-7 min-h-[480px]">
              {LINES.map((line, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: line.t * 0.3 + 0.4 }}
                  style={{ color: line.color, minHeight: "1.75rem" }}
                >
                  {line.text}
                </motion.div>
              ))}
              {/* Blinking cursor */}
              <motion.span
                animate={{ opacity: [1, 0, 1] }} 
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-accent align-middle ml-1"
              />
            </div>
            
            {/* Glow overlay */}
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>

          {/* Feature List next to terminal */}
          <div className="lg:w-2/5 space-y-12">
            {[
              {
                icon: Edit3,
                title: "Provide Job Links",
                desc: "Add links to the jobs you want to apply."
              },
              {
                icon: Cpu,
                title: "AI Does the Work",
                desc: "Our agent reads, understands, and fills the application perfectly."
              },
              {
                icon: TrendingUp,
                title: "You Get Results",
                desc: "Track everything in real-time and land more interviews."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + (i * 0.2) }}
                className="flex gap-6 group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0 group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">{item.title}</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2 }}
              className="pt-4"
            >
              <Link href="/dashboard">
                <button className="btn-cinematic !rounded-xl !py-4 !px-10 text-xs uppercase tracking-widest font-bold">
                  Get Started Free
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
