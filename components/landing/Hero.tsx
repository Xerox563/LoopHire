"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

/**
 * Main hero section with animated background and catchy headline
 */
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  
  // Parallax and fade effects on scroll
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start start", "end start"] 
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background visual effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glow effect */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,102,64,0.08) 0%, transparent 70%)" }} 
        />
        
        {/* Color gradients */}
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{ 
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,102,64,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.04) 0%, transparent 50%)" 
          }} 
        />
        
        {/* Subtle background grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{ 
            backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", 
            backgroundSize: "60px 60px" 
          }} 
        />
        
        {/* Floating decorative elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-32 right-1/4 w-3 h-3 rounded-full" 
          style={{ background: "var(--accent)" }} 
        />
        <motion.div 
          animate={{ y: [0, 15, 0], opacity: [0.2, 0.5, 0.2] }} 
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full" 
          style={{ background: "#3b82f6" }} 
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* AI Tech Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ border: "1px solid var(--border-bright)", background: "rgba(255,102,64,0.06)" }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
          <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
            Powered by Advanced AI Automation
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display leading-[1.05] mb-6"
          style={{ fontSize: "clamp(3rem, 8vw, 7rem)", color: "var(--text-primary)" }}
        >
          Land your dream job{" "}
          <span className="gradient-text italic">effortlessly</span>
          <br />with LoopHire.
        </motion.h1>

        {/* Value Proposition */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          AI-driven job matching and application automation. 
          Stop manual searching and let LoopHire handle the grind.
        </motion.p>

        {/* Primary Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/dashboard">
            <motion.button 
              whileHover={{ scale: 1.03, y: -2 }} 
              whileTap={{ scale: 0.97 }}
              className="btn-primary px-8 py-4 rounded-xl text-base font-medium relative overflow-hidden"
              style={{ minWidth: 200 }}
            >
              <span className="relative z-10">Get Started →</span>
              <motion.span 
                animate={{ x: ["-100%", "200%"] }} 
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 opacity-20"
                style={{ background: "linear-gradient(90deg, transparent, white, transparent)", width: "60%" }} 
              />
            </motion.button>
          </Link>
          <a href="https://github.com/Xerox563/LoopHire" target="_blank" rel="noopener noreferrer">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-xl text-base font-medium"
              style={{ border: "1px solid var(--border-bright)", color: "var(--text-secondary)", background: "transparent" }}
            >
              View Project
            </motion.button>
          </a>
        </motion.div>

        {/* Platform Stats */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1, delay: 0.6 }}
          className="flex gap-12 justify-center mt-16 pt-12"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {[
            ["1000+", "Jobs Tracked"],
            ["85%", "Better Match"],
            ["10x", "Faster Hiring"]
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl gradient-text">{val}</div>
              <div className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
