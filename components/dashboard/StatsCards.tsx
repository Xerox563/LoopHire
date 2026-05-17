"use client";

import { motion } from "framer-motion";
import { DashboardStats } from "@/types";

interface StatCardProps {
  label: string;
  value: number | string;
  color: string;
  icon: string;
  delay?: number;
  suffix?: string;
}

/**
 * Individual stat card with animation and hover effects
 */
function StatCard({ label, value, color, icon, delay = 0, suffix = "" }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, borderColor: color + "40" }}
      className="rounded-2xl p-6 cursor-default transition-colors"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        {/* Status indicator badge */}
        <span 
          className="text-xs font-medium px-2 py-1 rounded-full"
          style={{ background: color + "15", color }}
        >
          active
        </span>
      </div>
      <div 
        className="text-3xl font-bold mb-1" 
        style={{ color, fontFamily: "var(--font-display)" }}
      >
        {value}{suffix}
      </div>
      <div className="text-sm" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
    </motion.div>
  );
}

/**
 * Grid of statistics cards for the dashboard overview
 */
export default function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard label="Total jobs" value={stats.total} color="#f0f0f8" icon="📋" delay={0} />
      <StatCard label="Applied" value={stats.applied} color="#22c55e" icon="✅" delay={0.05} />
      <StatCard label="Pending" value={stats.pending} color="#eab308" icon="⏳" delay={0.1} />
      <StatCard label="Failed" value={stats.failed} color="#ef4444" icon="❌" delay={0.15} />
      <StatCard label="Success rate" value={stats.successRate} color="#ff6640" icon="📈" delay={0.2} suffix="%" />
    </div>
  );
}
