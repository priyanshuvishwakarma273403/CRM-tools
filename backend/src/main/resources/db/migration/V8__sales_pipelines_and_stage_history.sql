-- V8: Sales Engine, Dynamic Pipelines, Stages, and Stage Transition History

ALTER TABLE deals ADD COLUMN IF NOT EXISTS stage_entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS deal_stage_history (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    deal_id VARCHAR(36) NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    from_stage VARCHAR(50),
    to_stage VARCHAR(50) NOT NULL,
    from_stage_id VARCHAR(36),
    to_stage_id VARCHAR(36),
    duration_days INT DEFAULT 0,
    actor_id VARCHAR(36),
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_deal_stage_history_deal ON deal_stage_history(deal_id, created_at);
CREATE INDEX IF NOT EXISTS idx_deal_stage_history_org ON deal_stage_history(organization_id, to_stage);

-- Seed default sales pipeline for demo organization
INSERT INTO pipelines (id, organization_id, name, is_default, created_at)
VALUES ('pipe-default', 'org-demo-1', 'Standard Sales Pipeline', true, CURRENT_TIMESTAMP);

INSERT INTO pipeline_stages (id, organization_id, pipeline_id, name, code, order_index, win_probability, color_code) VALUES
('stage-1', 'org-demo-1', 'pipe-default', 'New Lead', 'NEW', 1, 10, '#3B82F6'),
('stage-2', 'org-demo-1', 'pipe-default', 'Qualified', 'QUALIFIED', 2, 25, '#10B981'),
('stage-3', 'org-demo-1', 'pipe-default', 'Product Demo', 'DEMO', 3, 50, '#8B5CF6'),
('stage-4', 'org-demo-1', 'pipe-default', 'Proposal Sent', 'PROPOSAL', 4, 70, '#F59E0B'),
('stage-5', 'org-demo-1', 'pipe-default', 'Negotiation', 'NEGOTIATION', 5, 85, '#6366F1'),
('stage-6', 'org-demo-1', 'pipe-default', 'Closed Won', 'WON', 6, 100, '#059669'),
('stage-7', 'org-demo-1', 'pipe-default', 'Closed Lost', 'LOST', 7, 0, '#EF4444');

-- Connect existing seed deals
UPDATE deals SET pipeline_id = 'pipe-default', stage_id = 'stage-4', stage_entered_at = CURRENT_TIMESTAMP WHERE id = 'deal-1';
UPDATE deals SET pipeline_id = 'pipe-default', stage_id = 'stage-5', stage_entered_at = CURRENT_TIMESTAMP WHERE id = 'deal-2';
UPDATE deals SET pipeline_id = 'pipe-default', stage_id = 'stage-6', stage_entered_at = CURRENT_TIMESTAMP WHERE id = 'deal-3';
