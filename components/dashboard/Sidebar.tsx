"use client";

import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  Layers, 
  Zap, 
  History,
  LogOut,
  ChevronRight,
  Rocket
} from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "job-links", label: "Job Links", icon: LinkIcon },
  { id: "ai-messages", label: "AI Messages", icon: MessageSquare },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "templates", label: "Templates", icon: Layers },
  { id: "automation", label: "Automation", icon: Zap },
  { id: "logs", label: "Logs", icon: History },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-72 h-screen fixed left-0 top-0 z-[70] flex flex-col premium-blur border-r border-white/5 p-6 overflow-y-auto custom-scrollbar">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="relative">
          <div className="absolute inset-0 bg-accent blur-lg opacity-20" />
          <div className="relative w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
            <Rocket className="w-5 h-5 text-white" />
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white">
          LoopHire
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-accent/10 text-white" 
                  : "text-text-secondary hover:bg-white/5 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-accent rounded-r-full"
                />
              )}
              <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-accent" : "text-text-muted"}`} />
              <span className="text-sm font-semibold tracking-wide flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 text-accent/50" />}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Status */}
      <div className="mt-8 space-y-6">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Rocket className="w-12 h-12 text-accent" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">LoopHire is active</span>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed font-medium">
            Your automation is running smarter, not harder.
          </p>
        </div>

        <Link href="/">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-error hover:bg-error/5 transition-all group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-wide">Logout Session</span>
          </button>
        </Link>
      </div>
    </aside>
  );
}
