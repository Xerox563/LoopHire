"use client";

import { motion } from "framer-motion";
import { 
  Plus, 
  Terminal, 
  Cpu, 
  Activity,
  LogOut,
  Settings
} from "lucide-react";
import Link from "next/link";

/**
 * Enterprise-Grade Dashboard Header
 * Features: Cinematic reveal, blur effects, status indicators
 */
export default function DashboardNav() {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="sticky top-0 z-[60] py-4 px-8 premium-blur border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Entity Info */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-accent blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-11 h-11 rounded-2xl bg-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-accent/20">
                <Cpu className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight text-white">
                LoopHire<span className="accent-gradient ml-0.5">OS</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                  Automation v2.0
                </span>
                <div className="w-1 h-1 rounded-full bg-white/10" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-success">
                  Stable
                </span>
              </div>
            </div>
          </Link>
          
          <div className="h-8 w-px bg-white/5 hidden lg:block" />
          
          {/* System Status */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-success animate-ping absolute inset-0" />
                <div className="w-2 h-2 rounded-full bg-success relative" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">
                Neural Engine <span className="text-success">Active</span>
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 shadow-inner">
              <Activity className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
                32ms Latency
              </span>
            </div>
          </div>
        </div>

        {/* System Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center p-1 rounded-2xl bg-white/[0.03] border border-white/5">
            <button className="p-2.5 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-all group">
              <Settings className="w-4.5 h-4.5 group-hover:rotate-90 transition-transform duration-500" />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <Link href="/">
              <button className="p-2.5 rounded-xl text-text-muted hover:text-error hover:bg-error/5 transition-all">
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </Link>
          </div>
          
          <button className="btn-premium !px-6 !py-2.5 !rounded-2xl flex items-center gap-2.5 group">
            <Terminal className="w-4 h-4 text-accent" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Console</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
