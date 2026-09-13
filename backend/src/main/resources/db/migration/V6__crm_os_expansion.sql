-- V6: CRM OS Enterprise Expansion
-- Support Ticketing, SLAs, Lead Conversions, Polymorphic Timeline, Feature Flags, Knowledge Base, and Deal Alignments

-- 1. Support & Ticketing Domain
CREATE TABLE IF NOT EXISTS tickets (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    ticket_number VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    category VARCHAR(100),
    customer_id VARCHAR(36) REFERENCES customers(id) ON DELETE SET NULL,
    contact_id VARCHAR(36) REFERENCES contacts(id) ON DELETE SET NULL,
    assignee_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    sla_due_at TIMESTAMP,
    first_responded_at TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tickets_org_status ON tickets(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_tickets_customer ON tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assignee ON tickets(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tickets_sla ON tickets(organization_id, sla_due_at);

CREATE TABLE IF NOT EXISTS ticket_comments (
    id VARCHAR(36) PRIMARY KEY,
    ticket_id VARCHAR(36) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    author_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(100),
    body TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket ON ticket_comments(ticket_id, created_at);

CREATE TABLE IF NOT EXISTS sla_policies (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    first_response_time_minutes INT NOT NULL DEFAULT 60,
    resolution_time_minutes INT NOT NULL DEFAULT 480,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sla_org_priority ON sla_policies(organization_id, priority);

-- 2. Lead Conversions Audit Table
CREATE TABLE IF NOT EXISTS lead_conversions (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lead_id VARCHAR(36) NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    company_id VARCHAR(36) REFERENCES companies(id) ON DELETE SET NULL,
    contact_id VARCHAR(36) REFERENCES contacts(id) ON DELETE SET NULL,
    deal_id VARCHAR(36) REFERENCES deals(id) ON DELETE SET NULL,
    customer_id VARCHAR(36) REFERENCES customers(id) ON DELETE SET NULL,
    converted_by_user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    converted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_lead_conv_org ON lead_conversions(organization_id, converted_at);
CREATE INDEX IF NOT EXISTS idx_lead_conv_lead ON lead_conversions(lead_id);

-- 3. Unified Polymorphic Timeline Events
CREATE TABLE IF NOT EXISTS timeline_events (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    actor_id VARCHAR(36),
    actor_name VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    payload_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_timeline_org_entity ON timeline_events(organization_id, entity_type, entity_id, created_at);

-- 4. Feature Flags Platform
CREATE TABLE IF NOT EXISTS feature_flags (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) REFERENCES organizations(id) ON DELETE CASCADE,
    flag_key VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    rules_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_flags_org_key ON feature_flags(organization_id, flag_key);

-- 5. Knowledge Base Documentation
CREATE TABLE IF NOT EXISTS knowledge_articles (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'GENERAL',
    status VARCHAR(50) DEFAULT 'PUBLISHED',
    view_count INT DEFAULT 0,
    author_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_articles_org_category ON knowledge_articles(organization_id, category);

-- 6. Align Deals Table Schema
ALTER TABLE deals ADD COLUMN IF NOT EXISTS customer_id VARCHAR(36);
ALTER TABLE deals ADD COLUMN IF NOT EXISTS pipeline_id VARCHAR(36);
ALTER TABLE deals ADD COLUMN IF NOT EXISTS stage_id VARCHAR(36);
ALTER TABLE deals ADD COLUMN IF NOT EXISTS loss_reason VARCHAR(255);
ALTER TABLE deals ADD COLUMN IF NOT EXISTS win_reason VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_deals_org_stage ON deals(organization_id, stage);
CREATE INDEX IF NOT EXISTS idx_deals_customer ON deals(customer_id);
CREATE INDEX IF NOT EXISTS idx_deals_company ON deals(company_id);
