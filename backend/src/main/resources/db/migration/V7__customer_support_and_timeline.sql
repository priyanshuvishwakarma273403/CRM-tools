-- V7: Customer Support CSAT, Ticket Indexing, and Search Enhancements

ALTER TABLE tickets ADD COLUMN IF NOT EXISTS csat_rating INT;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS csat_comment TEXT;

CREATE INDEX IF NOT EXISTS idx_tickets_number ON tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(organization_id, priority);
