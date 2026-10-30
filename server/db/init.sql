CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    organization VARCHAR(150) DEFAULT 'Independent Workspace',
    role_title VARCHAR(100) DEFAULT 'Decision Strategist',
    default_risk_appetite VARCHAR(20) DEFAULT 'BALANCED' CHECK (default_risk_appetite IN ('CONSERVATIVE', 'BALANCED', 'AGGRESSIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. DECISIONS TABLE (Core Workspace Record)
CREATE TABLE IF NOT EXISTS decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(180) NOT NULL,
    domain VARCHAR(40) NOT NULL CHECK (domain IN ('TECH_ARCH', 'PRODUCT_GTM', 'FINANCE_INVEST', 'OPERATIONS_SUPPLY', 'TALENT_ORG', 'POLICY_ESG')),
    urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    risk_appetite VARCHAR(20) NOT NULL CHECK (risk_appetite IN ('CONSERVATIVE', 'BALANCED', 'AGGRESSIVE')),
    stakeholders TEXT,
    problem_statement TEXT NOT NULL,
    budget_constraint VARCHAR(255),
    timeline_constraint VARCHAR(255),
    non_negotiables JSONB NOT NULL DEFAULT '[]'::jsonb,
    criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
    alternatives JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'ANALYZED' CHECK (status IN ('DRAFT', 'ANALYZED', 'ARCHIVED')),
    recommended_option_name VARCHAR(255),
    confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
    ai_report JSONB,
    is_bookmarked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. DECISION SIMULATIONS / WHAT-IF COPILOT LOGS
CREATE TABLE IF NOT EXISTS decision_simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_prompt TEXT NOT NULL,
    ai_simulation_response JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_decisions_user_id ON decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_decisions_domain ON decisions(domain);
CREATE INDEX IF NOT EXISTS idx_decisions_created_at ON decisions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_simulations_decision_id ON decision_simulations(decision_id);

-- ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE / POSTGRES
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_simulations ENABLE ROW LEVEL SECURITY;
