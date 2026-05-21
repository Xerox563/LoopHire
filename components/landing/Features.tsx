"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Cpu, 
  LineChart, 
  Target, 
  Rocket,
  Bell,
  Calendar,
  MessageSquare
} from "lucide-react";

const FEATURES = [
  { 
    icon: Cpu, 
    title: "Natural Engine", 
    desc: "Understands job descriptions like a human." 
  },
  { 
    icon: Rocket, 
    title: "Turbo Apply", 
    desc: "Applies to hundreds of jobs with perfect accuracy." 
  },
  { 
    icon: LineChart, 
    title: "Deep Analytics", 
    desc: "Insights and reports to optimize your job search." 
  },
  { 
    icon: Shield, 
    title: "Privacy First", 
    desc: "Your data is secure and never shared." 
  },
  { 
    icon: Target, 
    title: "Precision Matching", 
    desc: "Matches you with the best roles using advanced filters." 
  },
  { 
    icon: Bell, 
    title: "Instant Alerts", 
    desc: "Get notified when something important happens." 
  },
  { 
    icon: Calendar, 
    title: "Auto Schedule", 
    desc: "Automatically schedule interviews on your behalf." 
  },
  { 
    icon: MessageSquare, 
    title: "Doubt Resolver", 
    desc: "AI answers job-related doubts and application questions." 
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
            className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
          >
            BUILT FOR THE HIGH-GROWTH ELITE.
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white font-display text-5xl md:text-7xl font-bold tracking-tight"
          >
            Built for the <br /> <span className="accent-gradient">high-growth</span> elite.
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
