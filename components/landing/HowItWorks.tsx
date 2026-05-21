"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  Cpu, 
  Target, 
  Layout,
  Briefcase
} from "lucide-react";

const STEPS = [
  {
    icon: Cpu,
    title: "Smart Automation",
    desc: "We fill forms, answer questions, and upload your details.",
    label: "Step 01"
  },
  {
    icon: Zap,
    title: "AI Personalization",
    desc: "Every application is customized for the job and company.",
    label: "Step 02"
  },
  {
    icon: Layout,
    title: "Real-time Tracking",
    desc: "Track progress and get notified at every step.",
    label: "Step 03"
  },
  {
    icon: Briefcase,
    title: "More Interviews",
    desc: "Apply to more jobs, save time, and land more interviews.",
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
              className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-6"
            >
              AUTOMATE. PERSONALIZE. SUCCEED.
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white font-display text-5xl md:text-7xl font-bold tracking-tight mb-8"
            >
              Four steps to <br /> <span className="accent-gradient">career mastery.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary text-base max-w-xl mb-12 leading-relaxed"
            >
              LoopHire uses AI agents to handle the entire job application 
              process — so you can focus on what matters.
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
