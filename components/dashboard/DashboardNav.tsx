"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Top navigation bar for the dashboard area
 */
export default function DashboardNav() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
      style={{ 
        background: "rgba(10,10,15,0.95)", 
        backdropFilter: "blur(20px)", 
        borderBottom: "1px solid var(--border)" 
      }}
    >
      <div className="flex items-center gap-4">
        {/* Brand link back to home */}
        <Link href="/" className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: "var(--accent)", color: "white" }}
          >
            L
          </div>
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
            LoopHire
          </span>
        </Link>
        <span style={{ color: "var(--border-bright)" }}>·</span>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>Dashboard</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Status indicator for the automation engine */}
        <div 
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
          style={{ 
            background: "rgba(34,197,94,0.08)", 
            border: "1px solid rgba(34,197,94,0.15)", 
            color: "#22c55e" 
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Automation Active
        </div>
      </div>
    </motion.header>
  );
}
