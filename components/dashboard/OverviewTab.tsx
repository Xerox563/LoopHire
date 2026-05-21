"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Briefcase, 
  Send, 
  MessageCircle, 
  Calendar, 
  CheckCircle2,
  ChevronRight,
  Search,
  Bell,
  Plus
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useAutomation } from "@/components/providers/AutomationProvider";

export default function OverviewTab({ jobs }: { jobs: any[] }) {
  const { isRunning, logs, progress, stopAutomation } = useAutomation();

  const STATS = [
    { label: "Jobs in Queue", value: jobs.filter(j => j.status === 'pending').length.toString(), icon: Briefcase, color: "#ff6640", trend: "Live Queue" },
    { label: "Applications Sent", value: jobs.filter(j => j.status === 'applied').length.toString(), icon: Send, color: "#10b981", trend: "Total Sent" },
    { label: "Responses", value: "0", icon: MessageCircle, color: "#3b82f6", trend: "Active" },
    { label: "Interviews", value: "0", icon: Calendar, color: "#8b5cf6", trend: "Upcoming" },
    { label: "Success Rate", value: jobs.length > 0 ? Math.round((jobs.filter(j => j.status === 'applied').length / jobs.length) * 100).toString() + "%" : "0%", icon: CheckCircle2, color: "#f59e0b", trend: "Avg Rate" },
  ];

  const PIE_DATA = [
    { name: "Completed", value: jobs.filter(j => j.status === 'applied').length, color: "#10b981" },
    { name: "In Progress", value: jobs.filter(j => j.status === 'reviewing').length, color: "#ff6640" },
    { name: "Pending", value: jobs.filter(j => j.status === 'pending').length, color: "#f59e0b" },
    { name: "Failed", value: jobs.filter(j => j.status === 'failed').length, color: "#ef4444" },
  ];

  const CHART_DATA = [
    { name: "Mon", value: 10 },
    { name: "Tue", value: 25 },
    { name: "Wed", value: 45 },
    { name: "Thu", value: 30 },
    { name: "Fri", value: 55 },
    { name: "Sat", value: 70 },
    { name: "Sun", value: jobs.filter(j => j.status === 'applied').length },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Search and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Good evening, Rohit 👋
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Here's what's happening with your job automation today.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative group hidden xl:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search jobs, companies..." 
              className="bg-white/[0.03] border border-white/5 rounded-xl pl-11 pr-16 py-3 text-sm text-white focus:outline-none focus:border-accent/30 transition-all w-80"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-text-muted font-bold">
              ⌘K
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-text-secondary hover:text-white hover:bg-white/10 transition-all relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent border-2 border-background" />
            </button>
            <button className="btn-cinematic !py-3 !px-6 !rounded-xl flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" />
              Add Job Links
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-accent/20 overflow-hidden ml-2 cursor-pointer hover:border-accent transition-all">
              <img src="https://ui-avatars.com/api/?name=Rohit+G&background=ff6640&color=fff" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card !p-6 flex flex-col justify-between group hover:border-accent/20 transition-all cursor-default"
          >
            <div className="flex items-start justify-between">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundColor: `${stat.color}10`, borderColor: `${stat.color}20` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div className="text-[10px] font-bold text-success uppercase tracking-widest bg-success/5 px-2 py-1 rounded-md border border-success/10">
                {stat.trend}
              </div>
            </div>
            <div className="mt-6">
              <div className="text-3xl font-display font-bold text-white tracking-tighter mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Automation & Browser Preview Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card !p-0 overflow-hidden flex flex-col h-[500px]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-white tracking-tight">Live Automation</h2>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isRunning ? "bg-success/10 border-success/20" : "bg-white/5 border-white/10"}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-success animate-pulse" : "bg-text-muted"}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isRunning ? "text-success" : "text-text-muted"}`}>
                    {isRunning ? "Running" : "Standby"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Pause</button>
                <button 
                  onClick={stopAutomation}
                  disabled={!isRunning}
                  className="px-4 py-2 rounded-lg bg-error/10 border border-error/20 text-[11px] font-bold uppercase tracking-widest text-error hover:bg-error/20 transition-all disabled:opacity-30"
                >
                  Stop
                </button>
                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">View Logs</button>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-px bg-white/5">
              {/* AI Agent Console */}
              <div className="bg-background/40 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-success" : "bg-text-muted"}`} />
                    <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">AI Agent Console</span>
                  </div>
                </div>
                <div className="flex-1 font-mono text-[11px] space-y-2.5 overflow-y-auto custom-scrollbar pr-2">
                  {logs.length === 0 ? (
                    <div className="text-text-muted italic h-full flex items-center justify-center opacity-50">
                      Engine on standby. Start automation to view live telemetry...
                    </div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="flex gap-4 group">
                        <span className="text-text-muted shrink-0">{log.timestamp}</span>
                        <span className={`
                          ${log.type === "error" ? "text-error" : ""}
                          ${log.type === "warn" ? "text-warning" : ""}
                          ${log.type === "system" ? "text-accent font-bold" : "text-text-secondary"}
                        `}>
                          {log.message}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  <div className="flex items-center gap-4">
                    <span>Success Rate: <span className="text-success">94%</span></span>
                    <span>Pipeline: <span className="text-accent">{Math.round(progress)}%</span></span>
                  </div>
                </div>
              </div>

              {/* Browser Preview Placeholder */}
              <div className="bg-background/40 p-6 flex flex-col relative overflow-hidden group">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">Browser Preview</span>
                </div>
                <div className="flex-1 rounded-2xl border border-white/10 bg-surface flex flex-col overflow-hidden shadow-2xl">
                  <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-white/[0.02]">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-error/50" />
                      <div className="w-2 h-2 rounded-full bg-warning/50" />
                      <div className="w-2 h-2 rounded-full bg-success/50" />
                    </div>
                    <div className="flex-1 mx-4 h-5 bg-white/5 rounded-md border border-white/5" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#0077b5] flex items-center justify-center mb-6 shadow-xl shadow-[#0077b5]/20">
                      <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" className="w-8 h-8 invert" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-1">Software Engineer</h4>
                    <p className="text-sm text-text-secondary mb-8">Remote • Full-time</p>
                    <div className="w-full space-y-3 max-w-[200px]">
                      <div className="h-1.5 w-full bg-white/5 rounded-full" />
                      <div className="h-1.5 w-3/4 bg-white/5 rounded-full mx-auto" />
                      <div className="h-1.5 w-1/2 bg-white/5 rounded-full mx-auto" />
                    </div>
                    <div className="mt-10 p-4 rounded-xl bg-success/5 border border-success/10 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <span className="text-xs font-bold text-success uppercase tracking-widest">Application Submitted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Job Activity */}
          <div className="glass-card !p-0 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white tracking-tight">Recent Job Activity</h2>
              <button className="text-xs font-bold text-accent uppercase tracking-widest hover:underline flex items-center gap-2">
                View All Job Links <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Job Title</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Company</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Match Score</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Applied On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {jobs.slice(0, 5).map((job) => (
                    <tr key={job.id} className="group hover:bg-white/[0.02] transition-all">
                      <td className="px-8 py-5 text-sm font-semibold text-white">{job.role || "Job Link"}</td>
                      <td className="px-8 py-5 text-sm text-text-secondary">{job.company || "Pending..."}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${job.status === 'applied' ? 'bg-success' : job.status === 'reviewing' ? 'bg-accent' : 'bg-warning'}`} />
                          <span className={`text-[11px] font-bold uppercase tracking-widest ${job.status === 'applied' ? 'text-success' : job.status === 'reviewing' ? 'text-accent' : 'text-warning'}`}>{job.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-success" style={{ width: `85%` }} />
                          </div>
                          <span className="text-xs font-bold text-white">85%</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs text-text-muted">{job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : "Pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Charts and Activity Column */}
        <div className="space-y-8">
          {/* Application Trend Chart */}
          <div className="glass-card !p-8 h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Application Trend</h3>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-secondary focus:outline-none">
                <option>This Week</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6640" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ff6640" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#ff6640" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Applications by Status Pie */}
          <div className="glass-card !p-8 h-[350px] flex flex-col">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8">Applications by Status</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-display font-bold text-white">{jobs.length}</span>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Total</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-6 w-full">
                {PIE_DATA.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-white">{item.value} ({jobs.length > 0 ? Math.round(item.value / jobs.length * 100) : 0}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
