-- V5: Action Approvals & Shadow Mode Center
CREATE TABLE IF NOT EXISTS action_approvals (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    requester_id VARCHAR(36),
    action_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    payload_json TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    reviewer_id VARCHAR(36),
    reviewer_notes TEXT,
    expires_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_approvals_org_status ON action_approvals(organization_id, status);
