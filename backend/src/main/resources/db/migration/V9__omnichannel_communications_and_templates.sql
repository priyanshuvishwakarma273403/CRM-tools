-- V9: Omnichannel Communications Expansion, Threading, and Templates

ALTER TABLE communication_logs ADD COLUMN IF NOT EXISTS deal_id VARCHAR(36);
ALTER TABLE communication_logs ADD COLUMN IF NOT EXISTS ticket_id VARCHAR(36);
ALTER TABLE communication_logs ADD COLUMN IF NOT EXISTS thread_id VARCHAR(36);
ALTER TABLE communication_logs ADD COLUMN IF NOT EXISTS parent_id VARCHAR(36);
ALTER TABLE communication_logs ADD COLUMN IF NOT EXISTS template_id VARCHAR(36);

CREATE INDEX IF NOT EXISTS idx_comm_thread ON communication_logs(organization_id, thread_id);
CREATE INDEX IF NOT EXISTS idx_comm_deal ON communication_logs(organization_id, deal_id);
CREATE INDEX IF NOT EXISTS idx_comm_channel ON communication_logs(organization_id, channel);

CREATE TABLE IF NOT EXISTS communication_templates (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    body_template TEXT NOT NULL,
    variables_json TEXT,
    category VARCHAR(100) DEFAULT 'GENERAL',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_comm_templates_org ON communication_templates(organization_id, channel);

-- Seed default communication templates for demo organization
INSERT INTO communication_templates (id, organization_id, name, channel, subject, body_template, variables_json, category, is_active, created_at)
VALUES
('tmpl-1', 'org-demo-1', 'Executive Intro & Demo Follow-Up', 'EMAIL', 'Great meeting you, {{firstName}} - Next steps with {{companyName}}', 'Hi {{firstName}},\n\nThank you for taking the time to explore our enterprise CRM capabilities today. As discussed, attached are the technical specifications for {{companyName}}.\n\nBest regards,\nSales Team', '["firstName", "companyName"]', 'SALES_PITCH', true, CURRENT_TIMESTAMP),
('tmpl-2', 'org-demo-1', 'Proposal Review & Pricing Quote', 'EMAIL', 'Exclusive Proposal for {{companyName}} - {{dealTitle}}', 'Hello {{firstName}},\n\nPlease review our formal proposal for {{dealTitle}} with total investment of {{dealValue}}.\n\nLooking forward to closing this together.\n\nSincerely,\nAccount Director', '["firstName", "companyName", "dealTitle", "dealValue"]', 'FOLLOW_UP', true, CURRENT_TIMESTAMP),
('tmpl-3', 'org-demo-1', 'Support Ticket Acknowledgment', 'EMAIL', '[Ticket #{{ticketNumber}}] Support Request Received', 'Dear {{customerName}},\n\nWe have received your support request regarding "{{subject}}". Our technical support engineering team is actively working on it under ticket #{{ticketNumber}}.\n\nSupport Desk', '["customerName", "subject", "ticketNumber"]', 'SUPPORT_REPLY', true, CURRENT_TIMESTAMP),
('tmpl-4', 'org-demo-1', 'SMS Meeting Reminder', 'SMS', NULL, 'Hi {{firstName}}, quick reminder about our CRM strategy demo today at 3:00 PM. Reply 1 to confirm.', '["firstName"]', 'GENERAL', true, CURRENT_TIMESTAMP);
