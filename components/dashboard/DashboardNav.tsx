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
      className="sticky top-0 z-[60] py-6 px-8 premium-blur border-b border-white/5"
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Entity Info */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-accent/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-white">
                LoopHire <span className="text-accent ml-1 text-xs">OS</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                v1.2.0-stable
              </span>
            </div>
          </Link>
          
          <div className="h-8 w-px bg-white/5 hidden md:block" />
          
          {/* System Status */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/5 border border-success/10">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-success">
                Neural Core Active
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Activity className="w-3 h-3 text-text-muted" />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-text-secondary">
                Latency: 24ms
              </span>
            </div>
          </div>
        </div>

        {/* System Actions */}
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-white transition-all group">
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
          </button>
          
          <Link href="/">
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-error transition-all group">
              <LogOut className="w-4 h-4" />
            </button>
          </Link>
          
          <div className="w-px h-6 bg-white/5 mx-2" />
          
          <button className="btn-cinematic !py-2.5 !px-5 !rounded-xl flex items-center gap-2 shadow-none group">
            <Plus className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">New Node</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
