"use client";

import { motion } from "framer-motion";
import { 
  FileSearch, 
  BrainCircuit, 
  Send, 
  CheckCircle2 
} from "lucide-react";

const STEPS = [
  {
    icon: FileSearch,
    title: "Upload Profile",
    desc: "Our neural engine analyzes your career trajectory and technical strengths.",
    label: "Step 01"
  },
  {
    icon: BrainCircuit,
    title: "AI Analysis",
    desc: "Autonomous agents match your profile against millions of open positions.",
    label: "Step 02"
  },
  {
    icon: Send,
    title: "One-Click Apply",
    desc: "Automated delivery of high-signal applications tailored for each role.",
    label: "Step 03"
  },
  {
    icon: CheckCircle2,
    title: "Track Success",
    desc: "Experience real-time updates and interview invites on your dashboard.",
    label: "Step 04"
  }
];

/**
 * How It Works - Premium SaaS Timeline
 * Features: Cinematic reveal, glassmorphism, vertical rhythm
 */
export default function HowItWorks() {
  return (
    <section id="how" className="py-32 px-6 relative">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* Left Side: Content */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-6"
            >
              The Protocol
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gradient font-display text-5xl md:text-7xl font-bold tracking-tight mb-8"
            >
              Four steps to <br /> <span className="italic accent-gradient">career mastery.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary text-lg max-w-xl mb-12 leading-relaxed"
            >
              LoopHire eliminates the friction of manual job searching. 
              Our autonomous agents handle the complexity, so you can focus on the interviews.
            </motion.p>
          </div>

          {/* Right Side: Visual Steps */}
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass-card p-8 group"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-accent group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">
                    {step.label}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-accent transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
