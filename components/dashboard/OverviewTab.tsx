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

const STATS = [
  { label: "Jobs in Queue", value: "128", icon: Briefcase, color: "#ff6640", trend: "+ 22 this week" },
  { label: "Applications Sent", value: "342", icon: Send, color: "#10b981", trend: "+ 38 this week" },
  { label: "Responses", value: "24", icon: MessageCircle, color: "#3b82f6", trend: "+ 6 this week" },
  { label: "Interviews", value: "12", icon: Calendar, color: "#8b5cf6", trend: "+ 3 this week" },
  { label: "Success Rate", value: "34%", icon: CheckCircle2, color: "#f59e0b", trend: "↑ 8% this week" },
];

const CHART_DATA = [
  { name: "May 15", value: 45 },
  { name: "May 16", value: 38 },
  { name: "May 17", value: 55 },
  { name: "May 18", value: 48 },
  { name: "May 19", value: 65 },
  { name: "May 20", value: 75 },
  { name: "May 21", value: 90 },
];

const PIE_DATA = [
  { name: "Completed", value: 66, color: "#10b981" },
  { name: "In Progress", value: 22, color: "#ff6640" },
  { name: "Pending", value: 25, color: "#f59e0b" },
  { name: "Failed", value: 15, color: "#ef4444" },
];

export default function OverviewTab({ jobs }: { jobs: any[] }) {
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
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] font-bold text-success uppercase tracking-widest">Running</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Pause</button>
                <button className="px-4 py-2 rounded-lg bg-error/10 border border-error/20 text-[11px] font-bold uppercase tracking-widest text-error hover:bg-error/20 transition-all">Stop</button>
                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">View Logs</button>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-px bg-white/5">
              {/* AI Agent Console */}
              <div className="bg-background/40 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">AI Agent Console</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/10" />
                  </div>
                </div>
                <div className="flex-1 font-mono text-[11px] space-y-2.5 overflow-y-auto custom-scrollbar pr-2">
                  <div className="flex gap-4">
                    <span className="text-text-muted">09:41:22</span>
                    <span className="text-text-secondary italic">Initializing AI agent...</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-text-muted">09:41:25</span>
                    <span className="text-text-secondary">Opening browser...</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-text-muted">09:41:27</span>
                    <span className="text-text-secondary">Navigating to job board</span>
                  </div>
                  <div className="flex gap-4 text-accent">
                    <span className="text-text-muted">09:41:30</span>
                    <span className="font-bold">Analyzing requirements...</span>
                  </div>
                  <div className="flex gap-4 text-success">
                    <span className="text-text-muted">09:41:42</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="font-bold">Application submitted successfully</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-text-muted">09:41:42</span>
                    <span className="text-text-secondary">Moving to next job...</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  <div className="flex items-center gap-4">
                    <span>Success Rate: <span className="text-success">94%</span></span>
                    <span>Time Saved: <span className="text-accent">12h 45m</span></span>
                  </div>
                  <span>Applications Today: 28</span>
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
                  {[
                    { title: "Software Engineer", company: "Airbnb", status: "Completed", score: 92, date: "May 21, 2025" },
                    { title: "Frontend Developer", company: "Notion", status: "In Progress", score: 88, date: "May 21, 2025" },
                    { title: "Product Designer", company: "Stripe", status: "Completed", score: 85, date: "May 20, 2025" },
                    { title: "Backend Engineer", company: "Ramp", status: "Pending", score: 78, date: "May 20, 2025" },
                  ].map((job) => (
                    <tr key={job.company} className="group hover:bg-white/[0.02] transition-all">
                      <td className="px-8 py-5 text-sm font-semibold text-white">{job.title}</td>
                      <td className="px-8 py-5 text-sm text-text-secondary">{job.company}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${job.status === 'Completed' ? 'bg-success' : job.status === 'In Progress' ? 'bg-accent' : 'bg-warning'}`} />
                          <span className={`text-[11px] font-bold uppercase tracking-widest ${job.status === 'Completed' ? 'text-success' : job.status === 'In Progress' ? 'text-accent' : 'text-warning'}`}>{job.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-success" style={{ width: `${job.score}%` }} />
                          </div>
                          <span className="text-xs font-bold text-white">{job.score}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs text-text-muted">{job.date}</td>
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
                  <span className="text-2xl font-display font-bold text-white">128</span>
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
                    <span className="text-[10px] font-bold text-white">{item.value} ({Math.round(item.value / 128 * 100)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="glass-card !p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Recent Activity</h3>
              <button className="text-[10px] font-bold text-accent uppercase tracking-widest">View All</button>
            </div>
            <div className="space-y-6">
              {[
                { event: "Application submitted successfully", time: "2 mins ago", color: "#10b981" },
                { event: "AI message generated", time: "3 mins ago", color: "#3b82f6" },
                { event: "Resume uploaded", time: "5 mins ago", color: "#ff6640" },
                { event: "Review mode enabled", time: "8 mins ago", color: "#f59e0b" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all group-hover:scale-110" style={{ backgroundColor: `${item.color}10`, borderColor: `${item.color}20` }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{item.event}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
