"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Cpu, 
  LineChart, 
  Target, 
  Layout, 
  Clock, 
  Rocket 
} from "lucide-react";

const FEATURES = [
  { 
    icon: Cpu, 
    title: "Neural Engine", 
    desc: "Advanced matching algorithms that learn from your preferences and successful applications." 
  },
  { 
    icon: Rocket, 
    title: "Turbo Apply", 
    desc: "Scale your reach with one-click multi-platform application automation." 
  },
  { 
    icon: LineChart, 
    title: "Deep Analytics", 
    desc: "Real-time insights into your application performance and matching scores." 
  },
  { 
    icon: Shield, 
    title: "Privacy First", 
    desc: "Enterprise-grade encryption for your personal data and application history." 
  },
  { 
    icon: Target, 
    title: "Precision Matching", 
    desc: "Identify the high-signal opportunities that actually fit your career trajectory." 
  },
  { 
    icon: Zap, 
    title: "Instant Alerts", 
    desc: "Be the first to apply with our ultra-low latency job discovery engine." 
  },
  { 
    icon: Clock, 
    title: "Auto-Scheduler", 
    desc: "Optimal timing for application delivery based on historical recruiter activity." 
  },
  { 
    icon: Layout, 
    title: "Bento Workflow", 
    desc: "A beautifully organized workspace designed for clarity and high productivity." 
  },
];

/**
 * Modern Bento Grid Features
 * Features: Cinematic reveal, glassmorphism, depth shadows
 */
export default function Features() {
  return (
    <section id="features" className="py-32 px-6 relative overflow-hidden">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-4"
          >
            Engineering Excellence
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gradient font-display text-5xl md:text-7xl font-bold tracking-tight"
          >
            Built for the <br /> <span className="italic accent-gradient">high-growth</span> elite.
          </motion.h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass-card group"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <f.icon className="w-6 h-6 text-accent group-hover:text-accent-2 transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-accent transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {f.desc}
                </p>
              </div>
              
              {/* Subtle light effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0 opacity-50" />
    </section>
  );
}
