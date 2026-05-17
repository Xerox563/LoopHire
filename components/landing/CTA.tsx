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
    <section ref={ref} className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main CTA Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.96 }} 
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}} 
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-16 relative overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border-bright)" }}
        >
          {/* Decorative ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(255,102,64,0.12), transparent)" }} 
            />
          </div>

          <div className="relative z-10">
            {/* Tagline */}
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={inView ? { opacity: 1 } : {}} 
              transition={{ delay: 0.2 }}
              className="text-xs tracking-widest font-medium mb-6" 
              style={{ color: "var(--accent)" }}
            >
              BUILD YOUR CAREER WITH AI
            </motion.p>

            {/* Main Heading */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} 
              animate={inView ? { opacity: 1, y: 0 } : {}} 
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-display text-5xl md:text-6xl mb-6" 
              style={{ color: "var(--text-primary)" }}
            >
              Stop the manual grind.<br />
              <span className="gradient-text italic">Start landing interviews.</span>
            </motion.h2>

            {/* Supporting Text */}
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={inView ? { opacity: 1 } : {}} 
              transition={{ delay: 0.4 }}
              className="text-lg mb-10 max-w-lg mx-auto" 
              style={{ color: "var(--text-secondary)" }}
            >
              Join LoopHire today and let our AI-driven platform streamline your job search process from discovery to application.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={inView ? { opacity: 1, y: 0 } : {}} 
              transition={{ delay: 0.5 }}
              className="flex gap-4 justify-center flex-col sm:flex-row"
            >
              <Link href="/dashboard">
                <motion.button 
                  whileHover={{ scale: 1.04, y: -2 }} 
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary px-10 py-4 rounded-xl text-base font-medium"
                >
                  Open Dashboard →
                </motion.button>
              </Link>
              <Link href="#features">
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.97 }}
                  className="px-10 py-4 rounded-xl text-base font-medium"
                  style={{ border: "1px solid var(--border-bright)", color: "var(--text-secondary)" }}
                >
                  Explore Features
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
