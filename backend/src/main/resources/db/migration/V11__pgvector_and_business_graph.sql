-- V11: Vector Embeddings and Business Graph Indexes

-- 1. Business Graph Indexes for high-performance tenant queries
CREATE INDEX IF NOT EXISTS idx_companies_org_name ON companies(organization_id, name);
CREATE INDEX IF NOT EXISTS idx_contacts_org_email ON contacts(organization_id, email);
CREATE INDEX IF NOT EXISTS idx_deals_org_stage_val ON deals(organization_id, stage, "value");
CREATE INDEX IF NOT EXISTS idx_tasks_org_user_status ON tasks(organization_id, assigned_user_id, status);
CREATE INDEX IF NOT EXISTS idx_activities_org_entity ON activities(organization_id, related_entity_type, related_entity_id);

-- 2. Agent Execution Audit Trail table
CREATE TABLE IF NOT EXISTS agent_executions (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id),
    agent_type VARCHAR(50) NOT NULL,
    agent_name VARCHAR(100) NOT NULL,
    task_description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    response_summary TEXT,
    confidence NUMERIC(5,4),
    execution_time_ms INT,
    model_provider VARCHAR(50),
    model_name VARCHAR(100),
    tokens_used INT DEFAULT 0,
    estimated_cost_usd NUMERIC(10,6) DEFAULT 0.000000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agent_exec_org ON agent_executions(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_exec_user ON agent_executions(organization_id, user_id);
