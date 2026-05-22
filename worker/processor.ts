import { Worker, Job } from 'bullmq';
import { connection, ApplicationJobData } from '../lib/queue';
import { runJobApplications } from '../lib/automation/runner';
import { supabase } from '../lib/supabase';
import { AppConfig, JobRecord } from '../types';

export function startBackgroundWorker() {
  console.log('Initializing Background Worker (BullMQ)...');

  const worker = new Worker('job-applications', async (job: Job<ApplicationJobData>) => {
    console.log(`[WORKER] Processing job: ${job.data.company} - ${job.data.url}`);
    
    try {
      // Fetch fresh profile data
      const { data: profile } = await supabase
        .from('user_profile')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (!profile) throw new Error('User profile not found');

      const config: AppConfig = {
        openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
        openRouterModel: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat',
        headless: true,
        actionDelayMs: parseInt(process.env.ACTION_DELAY_MS || '1500', 10),
        maxRetries: 3,
        userProfile: {
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          phone: profile.phone,
          linkedinUrl: profile.linkedin_url,
          currentLocation: profile.current_location,
          portfolioUrl: profile.portfolio_url,
          githubUrl: profile.github_url,
          yearsOfExperience: profile.years_of_experience,
          desiredSalary: profile.desired_salary,
          usWorkAuthorization: profile.us_work_authorization,
          requiresSponsorship: profile.requires_sponsorship,
          resumeFilePath: profile.resume_file_path,
        },
      };

      const resumeText = `EXPERIENCE:\n${job.data.resumeData.experience}\n\nTECHNICAL SKILLS:\n${job.data.resumeData.technicalSkills}\n\nEDUCATION:\n${job.data.resumeData.education}\n\nPROJECTS:\n${job.data.resumeData.projects}`;

      const jobRecord: JobRecord = {
        id: job.data.id,
        url: job.data.url,
        company: job.data.company,
        role: job.data.role,
        outreachMessage: job.data.outreachMessage,
        status: 'pending',
      };

      // Run the automation for this single job
      await runJobApplications(config, [jobRecord], resumeText);
      
      console.log(`[WORKER] Finished processing job: ${job.data.company}`);
    } catch (error) {
      console.error(`[WORKER] Failed to process job ${job.data.company}:`, error);
      throw error; // Let BullMQ handle retries
    }
  }, { 
    connection,
    concurrency: 1 // Process one job at a time to avoid browser issues
  });

  worker.on('completed', (job) => {
    console.log(`[WORKER] Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[WORKER] Job ${job?.id} failed with error: ${err.message}`);
  });
}
