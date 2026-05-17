// Job status types for the application
export type JobStatus = "pending" | "applied" | "failed" | "skipped";

// Main job record structure
export interface JobRecord {
  id: string;
  url: string;
  company: string;
  role: string;
  status: JobStatus;
  appliedAt?: string;
  failureReason?: string;
  notes?: string;
}

// Statistics for the dashboard display
export interface DashboardStats {
  total: number;
  applied: number;
  pending: number;
  failed: number;
  skipped: number;
  successRate: number;
}
