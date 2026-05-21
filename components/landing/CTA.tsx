"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

/**
 * Call to Action section at the bottom of the landing page
 */
export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="cta" ref={ref} className="py-32 px-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-8"
        >
          STOP THE MANUAL GRIND
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-white font-display text-5xl md:text-7xl font-bold tracking-tight mb-8"
        >
          Stop the manual grind. <br />
          <span className="accent-gradient italic">Start landing interviews.</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Join professionals who let AI handle applications so they can 
          focus on cracking interviews.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/dashboard">
            <button className="btn-cinematic !rounded-xl !py-4 !px-12 text-xs uppercase tracking-widest font-bold group">
              Get Started Free
            </button>
          </Link>
          <Link href="#features">
            <button className="px-12 py-4 rounded-xl border border-white/10 text-xs uppercase tracking-widest font-bold text-text-secondary hover:text-white hover:bg-white/5 transition-all">
              Explore Features
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Subtle Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/10 rounded-full blur-[120px] pointer-events-none -mb-40" />
    </section>
  );
}
