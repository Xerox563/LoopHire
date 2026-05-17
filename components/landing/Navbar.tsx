"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

/**
 * Top navigation bar that becomes opaque on scroll
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Change background when scrolling past 40px
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300"
      style={{ 
        background: scrolled ? "rgba(10,10,15,0.9)" : "transparent", 
        backdropFilter: scrolled ? "blur(20px)" : "none", 
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent" 
      }}
    >
      {/* Brand logo and name */}
      <Link href="/" className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{ background: "var(--accent)", color: "white" }}
        >
          L
        </div>
        <span className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
          LoopHire
        </span>
      </Link>

      {/* Navigation links - hidden on mobile */}
      <div className="hidden md:flex items-center gap-8">
        {[
          ["#how", "How it works"], 
          ["#features", "Features"], 
          ["#demo", "Demo"]
        ].map(([href, label]) => (
          <a 
            key={label} 
            href={href} 
            className="text-sm transition-colors duration-200 hover:opacity-100"
            style={{ color: "var(--text-secondary)" }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Dashboard access button */}
      <Link href="/dashboard">
        <motion.button 
          whileHover={{ scale: 1.04 }} 
          whileTap={{ scale: 0.96 }}
          className="btn-primary px-5 py-2.5 rounded-lg text-sm font-medium"
        >
          Dashboard →
        </motion.button>
      </Link>
    </motion.nav>
  );
}
