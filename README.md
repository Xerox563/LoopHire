# LoopHire

LoopHire is a high-performance job application automation suite. It leverages Large Language Models (LLMs) and browser automation to handle the end-to-end job application lifecycle, from data parsing to personalized outreach.

## Key Features

- **Autonomous Application Engine**: Utilizes Playwright for robust, multi-step browser automation across various job portals.
- **AI-Driven Personalization**: Dynamically generates context-aware outreach messages by mapping candidate profiles to specific job requirements.
- **Real-time Telemetry**: Integrated logging system providing live feedback on automation execution and pipeline status.
- **Human-in-the-Loop Architecture**: Optional verification checkpoints for AI-generated content to ensure quality and accuracy.
- **Data Persistence**: Automated synchronization with Supabase for application tracking and historical logging.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Node.js
- **Automation**: Playwright
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenRouter
- **Styling**: Tailwind CSS / Framer Motion

## Infrastructure & Deployment

The platform is designed for a hybrid cloud architecture to optimize for performance and long-running processes:

- **Frontend/API**: Vercel
- **Automation Worker**: Render (Docker-based)
- **Database**: Supabase

## Local Development

### Configuration
Environment variables required in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
NEXT_PUBLIC_WORKER_URL=
```

### Setup
1. **Dependencies**: `npm install`
2. **UI Development**: `npm run dev`
3. **Worker Execution**: `npm run worker`

## Architecture Overview

The system consists of a Next.js frontend communicating with a dedicated Node.js worker. The worker manages the Playwright browser instances, executing application flows while streaming real-time status updates back to the client via NDJSON.
