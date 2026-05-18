"use client";

import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { DashboardStats } from "@/types";
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react";

// Mock data for the cinematic chart
const CHART_DATA = [
  { name: "Mon", apps: 12 },
  { name: "Tue", apps: 18 },
  { name: "Wed", apps: 15 },
  { name: "Thu", apps: 25 },
  { name: "Fri", apps: 32 },
  { name: "Sat", apps: 28 },
  { name: "Sun", apps: 35 },
];

interface StatCardProps {
  label: string;
  value: number | string;
  icon: any;
  trend?: string;
  color: string;
  delay: number;
}

function StatCard({ label, value, icon: Icon, trend, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card !p-6 flex flex-col justify-between min-h-[160px]"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && (
          <div className="text-[10px] font-bold text-success bg-success/10 px-2 py-1 rounded-full flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
        <div className="text-xs font-medium text-text-muted uppercase tracking-widest">{label}</div>
      </div>
    </motion.div>
  );
}

/**
 * Futuristic Stats Overview
 * Features: Recharts analytics, Glassmorphic bento stats
 */
export default function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Cinematic Chart Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2 glass-card !p-6 flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted">Activity Velocity</h3>
            <p className="text-2xl font-bold tracking-tight">System Performance</p>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">Live Engine</span>
          </div>
        </div>
        
        <div className="flex-1 min-h-[200px] w-full relative">
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6640" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff6640" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#0a0a0a", 
                  border: "1px solid #2a2a2a",
                  borderRadius: "12px",
                  fontSize: "12px"
                }}
              />
              <Area 
                type="monotone" 
                dataKey="apps" 
                stroke="#ff6640" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorApps)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>

      {/* Bento Stats Grid */}
      <div className="lg:col-span-2 grid grid-cols-2 gap-4">
        <StatCard 
          label="Total Pipeline" 
          value={stats.total} 
          icon={Users} 
          trend="+12%" 
          color="#ffffff" 
          delay={0.1} 
        />
        <StatCard 
          label="Success Rate" 
          value={`${stats.successRate}%`} 
          icon={CheckCircle2} 
          color="#10b981" 
          delay={0.2} 
        />
        <StatCard 
          label="Active Jobs" 
          value={stats.pending} 
          icon={Clock} 
          color="#f59e0b" 
          delay={0.3} 
        />
        <StatCard 
          label="Failed Nodes" 
          value={stats.failed} 
          icon={AlertCircle} 
          color="#ef4444" 
          delay={0.4} 
        />
      </div>
    </div>
  );
}
