-- 1. Drop existing tables with CASCADE to handle dependencies and start fresh
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS resume CASCADE;
DROP TABLE IF EXISTS user_profile CASCADE;

-- 2. Create User Profile table for auto-filling personal information
CREATE TABLE user_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    current_location TEXT,
    portfolio_url TEXT,
    github_url TEXT,
    years_of_experience TEXT,
    desired_salary TEXT,
    us_work_authorization TEXT, -- 'Yes' or 'No'
    requires_sponsorship TEXT,    -- 'Yes' or 'No'
    resume_file_path TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Resume table for AI-parsed resume sections
CREATE TABLE resume (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experience TEXT,
    technical_skills TEXT,
    education TEXT,
    projects TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Jobs table for tracking applications
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

-- 5. Enable Row Level Security (RLS)
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- 6. Create Access Policies (Allow all access for internal/demo tool)
DROP POLICY IF EXISTS "Allow all access to user_profile" ON user_profile;
CREATE POLICY "Allow all access to user_profile" ON user_profile FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to resume" ON resume;
CREATE POLICY "Allow all access to resume" ON resume FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to jobs" ON jobs;
CREATE POLICY "Allow all access to jobs" ON jobs FOR ALL USING (true) WITH CHECK (true);
