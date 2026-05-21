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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card !p-7 flex flex-col justify-between min-h-[180px] group cursor-default"
    >
      <div className="flex items-start justify-between">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
          style={{ backgroundColor: `${color}10`, border: `1px solid ${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        {trend && (
          <div className="text-[10px] font-bold text-success bg-success/10 px-2.5 py-1 rounded-lg border border-success/20 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-4xl font-display font-bold tracking-tighter mb-1 text-gradient group-hover:accent-gradient transition-all duration-500">{value}</div>
        <div className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">{label}</div>
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Cinematic Chart Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2 glass-card !p-8 flex flex-col min-h-[380px]"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted mb-1">Activity Velocity</h3>
            <p className="text-3xl font-display font-bold text-white tracking-tight">System Throughput</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-accent/5 border border-accent/10">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_#ff6640]" />
            <span className="text-[11px] font-bold text-accent uppercase tracking-widest">Live Node</span>
          </div>
        </div>
        
        <div className="flex-1 w-full relative">
          <div className="absolute inset-0 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6640" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ff6640" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#52525b', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(10, 10, 10, 0.8)", 
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "16px",
                    backdropFilter: "blur(20px)",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "white"
                  }}
                  itemStyle={{ color: "#ff6640" }}
                  cursor={{ stroke: '#ff6640', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="apps" 
                  stroke="#ff6640" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorApps)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Bento Stats Grid */}
      <div className="lg:col-span-2 grid grid-cols-2 gap-6">
        <StatCard 
          label="Total Applications" 
          value={stats.total} 
          icon={Users} 
          trend="+12%" 
          color="#ffffff" 
          delay={0.1} 
        />
        <StatCard 
          label="Success Probability" 
          value={`${stats.successRate}%`} 
          icon={CheckCircle2} 
          color="#10b981" 
          delay={0.2} 
        />
        <StatCard 
          label="Pending Nodes" 
          value={stats.pending} 
          icon={Clock} 
          color="#f59e0b" 
          delay={0.3} 
        />
        <StatCard 
          label="Error Rate" 
          value={stats.failed} 
          icon={AlertCircle} 
          color="#ef4444" 
          delay={0.4} 
        />
      </div>
    </div>
  );
}
