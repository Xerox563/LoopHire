import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runJobApplications } from '../lib/automation/runner';
import { setLogger } from '../lib/automation/utils/logger';
import { AppConfig, JobRecord } from '../types';
import { supabase } from '../lib/supabase';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/run-automation', async (req, res) => {
  const { jobs, resumeData } = req.body;

  // Set up streaming response
  res.setHeader('Content-Type', 'application/x-ndjson');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const send = (data: any) => {
    res.write(JSON.stringify(data) + '\n');
  };

  // Set up a custom logger that pipes to the response stream
  setLogger({
    info: (msg) => send({ type: 'log', message: msg, level: 'info' }),
    warn: (msg) => send({ type: 'log', message: msg, level: 'warn' }),
    error: (msg) => send({ type: 'log', message: msg, level: 'error' }),
    prompt: async (msg) => {
      send({ type: 'prompt', message: msg });
      return true;
    }
  });

  try {
    send({ type: 'log', message: 'Starting Render Worker Engine...', level: 'system' });
    send({ type: 'progress', value: 5 });

    // Fetch User Profile from Supabase
    const { data: profile } = await supabase
      .from('user_profile')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    const userProfile = profile ? {
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
    } : undefined;

    const config: AppConfig = {
      openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
      openRouterModel: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat',
      headless: true, // Always headless on Render
      actionDelayMs: parseInt(process.env.ACTION_DELAY_MS || '1200', 10),
      maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
      userProfile,
    };

    const resumeText = `EXPERIENCE:\n${resumeData.experience}\n\nTECHNICAL SKILLS:\n${resumeData.technicalSkills}\n\nEDUCATION:\n${resumeData.education}\n\nPROJECTS:\n${resumeData.projects}`;

    // Run the automation
    const results = await runJobApplications(config, jobs as JobRecord[], resumeText);

    send({ type: 'progress', value: 100 });
    send({ type: 'done', results });
    res.end();

  } catch (error) {
    send({ type: 'error', message: error instanceof Error ? error.message : String(error) });
    res.end();
  }
});

// Mirror the confirm-job API for convenience
app.post('/confirm-job', async (req, res) => {
    const { id, action } = req.body;
    try {
      const status = action === "confirm" ? "applying" : "skipped";
      const { error } = await supabase
        .from("jobs")
        .update({ status })
        .eq("id", id);
  
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => {
  res.send('Worker is healthy');
});

app.listen(port, () => {
  console.log(`Automation worker listening on port ${port}`);
});
