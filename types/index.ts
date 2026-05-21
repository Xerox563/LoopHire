// Job status types for the application
export type JobStatus = "pending" | "applied" | "failed" | "skipped" | "reviewing" | "confirmed";

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
  outreachMessage?: string;
  outreachSubject?: string;
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

// --- Migrated from yc-apply ---

export interface JobDetail {
  company: string;
  role: string;
  description: string;
  url: string;
}

export interface GeneratedMessage {
  subject: string;
  body: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  currentLocation: string;
  portfolioUrl: string;
  githubUrl: string;
  yearsOfExperience?: string;
  desiredSalary?: string;
  usWorkAuthorization?: string;
  requiresSponsorship?: string;
  resumeFilePath?: string;
}

export interface AppConfig {
  openRouterApiKey: string;
  openRouterModel: string;
  headless: boolean;
  actionDelayMs: number;
  maxRetries: number;
  userProfile?: UserProfile;
}

export interface RunResult {
  jobId: string;
  success: boolean;
  status: JobStatus;
  message?: string;
  error?: string;
}
