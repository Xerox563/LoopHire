import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const connection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const jobQueue = new Queue('job-applications', { connection });

export interface ApplicationJobData {
  id: string;
  url: string;
  company: string;
  role: string;
  outreachMessage: string;
  resumeData: any;
}
