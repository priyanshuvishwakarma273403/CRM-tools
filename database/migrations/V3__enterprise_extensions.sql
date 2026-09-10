-- V3: Enterprise CRM Extensions (Customer 360, Omnichannel, Pipelines, AI Predictions, Workflows)

-- 1. Pipelines & Custom Stages
CREATE TABLE IF NOT EXISTS pipelines (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pipelines_org ON pipelines(organization_id);

CREATE TABLE IF NOT EXISTS pipeline_stages (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    pipeline_id VARCHAR(36) NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    win_probability INT DEFAULT 10,
    color_code VARCHAR(20) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_stages_pipeline ON pipeline_stages(pipeline_id, order_index);

-- 2. Customer 360 Core Table
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    customer_type VARCHAR(50) DEFAULT 'ORGANIZATION',
    company_id VARCHAR(36) REFERENCES companies(id) ON DELETE SET NULL,
    primary_contact_id VARCHAR(36) REFERENCES contacts(id) ON DELETE SET NULL,
    owner_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    industry VARCHAR(100),
    tier VARCHAR(50) DEFAULT 'STANDARD',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    health_score INT DEFAULT 85,
    lifetime_value NUMERIC(18,2) DEFAULT 0.00,
    annual_recurring_revenue NUMERIC(18,2) DEFAULT 0.00,
    churn_probability NUMERIC(5,2) DEFAULT 0.00,
    last_contacted_at TIMESTAMP,
    tags VARCHAR(255),
    custom_attributes_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_customers_org_status ON customers(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_customers_org_health ON customers(organization_id, health_score);
CREATE INDEX IF NOT EXISTS idx_customers_owner ON customers(owner_id);

-- 3. Omnichannel Communications
CREATE TABLE IF NOT EXISTS communication_logs (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id VARCHAR(36) REFERENCES customers(id) ON DELETE SET NULL,
    lead_id VARCHAR(36) REFERENCES leads(id) ON DELETE SET NULL,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    channel VARCHAR(50) NOT NULL,
    direction VARCHAR(20) NOT NULL DEFAULT 'OUTBOUND',
    subject VARCHAR(255),
    content TEXT,
    sender VARCHAR(255),
    recipient VARCHAR(255),
    status VARCHAR(50) DEFAULT 'SENT',
    sentiment VARCHAR(20),
    recording_url VARCHAR(500),
    metadata_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_comm_customer_time ON communication_logs(organization_id, customer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_comm_lead_time ON communication_logs(organization_id, lead_id, created_at);

-- 4. Deal Risk Factors
CREATE TABLE IF NOT EXISTS deal_risk_factors (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    deal_id VARCHAR(36) NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    risk_level VARCHAR(20) NOT NULL,
    factor_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    suggested_action TEXT,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_deal_risk_deal ON deal_risk_factors(deal_id);

-- 5. AI Predictions & Model Inferences
CREATE TABLE IF NOT EXISTS ai_predictions (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    prediction_type VARCHAR(50) NOT NULL,
    score_value NUMERIC(8,2) NOT NULL,
    confidence_score NUMERIC(5,2),
    factors_json TEXT,
    model_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_entity ON ai_predictions(organization_id, entity_type, entity_id);

-- 6. Workflow Rule Executions
CREATE TABLE IF NOT EXISTS workflow_executions (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workflow_id VARCHAR(36) NOT NULL REFERENCES workflow_rules(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL,
    execution_log TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_wf_exec_workflow ON workflow_executions(workflow_id, executed_at);

-- 7. Embeddings Storage for Vector Search / RAG
CREATE TABLE IF NOT EXISTS embeddings (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    content_chunk TEXT NOT NULL,
    vector_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_embeddings_entity ON embeddings(organization_id, entity_type, entity_id);
