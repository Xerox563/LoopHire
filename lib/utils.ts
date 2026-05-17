import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { JobRecord, DashboardStats } from "@/types";

// Helper for combining tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate dashboard stats from the list of jobs
export function computeStats(jobs: JobRecord[]): DashboardStats {
  const total = jobs.length;
  const applied = jobs.filter((j) => j.status === "applied").length;
  const pending = jobs.filter((j) => j.status === "pending").length;
  const failed = jobs.filter((j) => j.status === "failed").length;
  const skipped = jobs.filter((j) => j.status === "skipped").length;
  
  // Percentage of successfully applied jobs
  const successRate = total > 0 ? Math.round((applied / total) * 100) : 0;
  
  return { total, applied, pending, failed, skipped, successRate };
}

// Format ISO date strings into something readable
export function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", 
    day: "numeric", 
    hour: "2-digit", 
    minute: "2-digit",
  });
}

// Get the hex color code for a given status
export function statusColor(status: string): string {
  switch (status) {
    case "applied": return "#22c55e"; // green
    case "pending": return "#eab308"; // yellow
    case "failed": return "#ef4444";  // red
    case "skipped": return "#8888aa"; // muted
    default: return "#8888aa";
  }
}
