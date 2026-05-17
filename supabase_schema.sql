-- Table for storing parsed resume data
CREATE TABLE IF NOT EXISTS resume (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experience TEXT,
    technical_skills TEXT,
    education TEXT,
    projects TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing job applications
CREATE TABLE IF NOT EXISTS jobs (
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

-- Policy to allow all access (since this is an internal/demo tool)
-- Note: In production, you would use RLS with Auth
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to resume" ON resume FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to jobs" ON jobs FOR ALL USING (true) WITH CHECK (true);
