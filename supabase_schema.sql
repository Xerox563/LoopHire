-- 1. Drop existing tables to start fresh (this ensures no column mismatches)
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS resume;

-- Table for storing user personal information for auto-filling
CREATE TABLE IF NOT EXISTS user_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    current_location TEXT,
    portfolio_url TEXT,
    github_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policy to allow all access to user_profile
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to user_profile" ON user_profile FOR ALL USING (true) WITH CHECK (true);

-- 2. Create the Resume table with correct columns
CREATE TABLE resume (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experience TEXT,
    technical_skills TEXT,
    education TEXT,
    projects TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create the Jobs table with all required columns
CREATE TABLE jobs (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    company TEXT,
    role TEXT,
    status TEXT DEFAULT 'pending',
    applied_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    notes TEXT,
    outreach_message TEXT,
    outreach_subject TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Security
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- 5. Create fresh policies (dropping old ones first if they exist)
DROP POLICY IF EXISTS "Allow all access to resume" ON resume;
DROP POLICY IF EXISTS "Allow all access to jobs" ON jobs;

CREATE POLICY "Allow all access to resume" ON resume FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to jobs" ON jobs FOR ALL USING (true) WITH CHECK (true);