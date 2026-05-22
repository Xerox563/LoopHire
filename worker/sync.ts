import cron from 'node-cron';
import { getGoogleSheetsData } from '../lib/googleSheets';
import { supabase } from '../lib/supabase';
import { jobQueue } from '../lib/queue';

export function startBackgroundSync() {
  console.log('Initializing Background Sync (Cron: every 15 mins)...');
  
  // Run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    console.log('[SYNC] Starting Google Sheets synchronization...');
    
    try {
      const sheetJobs = await getGoogleSheetsData();
      if (sheetJobs.length === 0) {
        console.log('[SYNC] No jobs found in sheet.');
        return;
      }

      // Get resume data once for all jobs in this batch
      const { data: resume } = await supabase
        .from('resume')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (!resume) {
        console.warn('[SYNC] No resume found in DB. Skipping automation.');
        return;
      }

      for (const job of sheetJobs) {
        // Check if job already exists in Supabase
        const { data: existing } = await supabase
          .from('jobs')
          .select('id, status')
          .eq('url', job.url)
          .single();

        if (existing) {
          // If it exists and is still pending, we can re-queue it if needed, 
          // but usually we just skip to avoid duplicates.
          continue;
        }

        // Add new job to Supabase
        const jobId = `job_gs_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const { error } = await supabase
          .from('jobs')
          .insert({
            id: jobId,
            url: job.url,
            company: job.company,
            role: job.role,
            outreach_message: job.outreachMessage,
            status: 'pending'
          });

        if (!error) {
          console.log(`[SYNC] Added new job from sheet: ${job.company} - ${job.url}`);
          
          // Add to BullMQ for background processing
          await jobQueue.add('apply', {
            id: jobId,
            url: job.url,
            company: job.company,
            role: job.role,
            outreachMessage: job.outreachMessage,
            resumeData: {
              experience: resume.experience,
              technicalSkills: resume.technical_skills,
              education: resume.education,
              projects: resume.projects
            }
          }, {
            removeOnComplete: true,
            attempts: 3,
            backoff: { type: 'exponential', delay: 10000 }
          });
        }
      }
    } catch (error) {
      console.error('[SYNC] Error during background sync:', error);
    }
  });
}
