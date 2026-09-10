-- Canonical CRM Production Demo Seed Data

-- 1. Organizations
INSERT INTO organizations (id, name, domain) 
VALUES ('org-demo-1', 'Acme Corporation', 'acme.com')
;

-- 2. Roles & Permissions
INSERT INTO roles (id, organization_id, name, code, description, is_system) VALUES
('role-admin', 'org-demo-1', 'Administrator', 'ADMIN', 'Full system access and tenant management', true),
('role-manager', 'org-demo-1', 'Sales Manager', 'MANAGER', 'Manages team leads, deals, and reports', true),
('role-agent', 'org-demo-1', 'Sales Agent', 'SALES_AGENT', 'Manages assigned leads and deal activities', true),
('role-support', 'org-demo-1', 'Support Agent', 'SUPPORT_AGENT', 'Customer support and ticket management', true)
;

INSERT INTO permissions (id, code, module, action, description) VALUES
('p1', 'LEAD_READ', 'LEADS', 'READ', 'View lead records'),
('p2', 'LEAD_CREATE', 'LEADS', 'CREATE', 'Create new leads'),
('p3', 'LEAD_UPDATE', 'LEADS', 'UPDATE', 'Update existing leads'),
('p4', 'LEAD_DELETE', 'LEADS', 'DELETE', 'Delete leads'),
('p5', 'DEAL_READ', 'DEALS', 'READ', 'View sales pipeline deals'),
('p6', 'DEAL_CREATE', 'DEALS', 'CREATE', 'Create new deal opportunities'),
('p7', 'DEAL_UPDATE', 'DEALS', 'UPDATE', 'Update deal stage and value'),
('p8', 'REPORT_READ', 'REPORTS', 'READ', 'View executive reports and analytics')
;

-- 3. Users (Password: password123)
INSERT INTO users (id, organization_id, email, password_hash, full_name, role, active)
VALUES 
('usr-demo-1', 'org-demo-1', 'admin@apexcrm.com', '$2a$10$wN362D8a9K85X4Xk.0hYCeQGZkO1JkP2xL5e5B5F.k.k', 'Alex Vance', 'ADMIN', true),
('usr-demo-2', 'org-demo-1', 'priyanshu@apexcrm.com', '$2a$10$wN362D8a9K85X4Xk.0hYCeQGZkO1JkP2xL5e5B5F.k.k', 'Priyanshu Sharma', 'ADMIN', true),
('usr-demo-3', 'org-demo-1', 'sarah.connor@apexcrm.com', '$2a$10$wN362D8a9K85X4Xk.0hYCeQGZkO1JkP2xL5e5B5F.k.k', 'Sarah Connor', 'SALES_AGENT', true)
;

-- 4. Companies
INSERT INTO companies (id, organization_id, name, industry, website, employees, annual_revenue, phone, email, address, city, country, owner_id)
VALUES
('comp-1', 'org-demo-1', 'Acme Technologies', 'Enterprise SaaS', 'https://acme.tech', 450, 12500000.00, '+1 800-555-0199', 'info@acme.tech', '100 Tech Blvd', 'San Francisco', 'USA', 'usr-demo-1'),
('comp-2', 'org-demo-1', 'Nexus Global Systems', 'FinTech', 'https://nexusglobal.io', 120, 4800000.00, '+44 20 7946 0912', 'contact@nexusglobal.io', '22 Financial Way', 'London', 'UK', 'usr-demo-2'),
('comp-3', 'org-demo-1', 'Innova Health Labs', 'Healthcare', 'https://innovalabs.org', 85, 2100000.00, '+91 22 2876 5432', 'hello@innovalabs.org', '12 Bandra Complex', 'Mumbai', 'India', 'usr-demo-3')
;

-- 5. Contacts
INSERT INTO contacts (id, organization_id, owner_id, first_name, last_name, email, phone, designation, company_id, tags, notes)
VALUES
('cont-1', 'org-demo-1', 'usr-demo-1', 'David', 'Kovac', 'david.kovac@acme.tech', '+1 555-0143', 'Chief Technology Officer', 'comp-1', 'VIP,Executive', 'Key decision maker for Q4 cloud migration.'),
('cont-2', 'org-demo-1', 'usr-demo-2', 'Rachel', 'Green', 'rachel.g@nexusglobal.io', '+44 7700 900123', 'VP of Product', 'comp-2', 'Product,Growth', 'Met at London FinTech Summit 2026.'),
('cont-3', 'org-demo-1', 'usr-demo-3', 'Dr. Aris', 'Thorne', 'thorne@innovalabs.org', '+91 98200 11223', 'Director of Research', 'comp-3', 'Clinical,BioTech', 'Evaluating HIPAA compliant CRM.')
;

-- 6. Leads
INSERT INTO leads (id, organization_id, owner_id, first_name, last_name, company_name, email, phone, status, score, source)
VALUES 
('lead-1', 'org-demo-1', 'usr-demo-1', 'Rahul', 'Sharma', 'Acme Technologies', 'rahul@acme.com', '+91 98765 43210', 'QUALIFIED', 85, 'WEBSITE'),
('lead-2', 'org-demo-1', 'usr-demo-2', 'Ankit', 'Verma', 'Nexus Global', 'ankit@nexus.io', '+91 98765 12345', 'CONTACTED', 65, 'LINKEDIN'),
('lead-3', 'org-demo-1', 'usr-demo-3', 'Priya', 'Patel', 'Innova Labs', 'priya@innova.com', '+91 98111 22334', 'NEW', 45, 'CONFERENCE')
;

-- 7. Deals
INSERT INTO deals (id, organization_id, owner_id, title, "value", currency, stage, probability, expected_close_date, company_id, contact_id)
VALUES
('deal-1', 'org-demo-1', 'usr-demo-1', 'Acme Cloud Enterprise License', 350000.00, 'INR', 'PROPOSAL', 60, '2026-10-15', 'comp-1', 'cont-1'),
('deal-2', 'org-demo-1', 'usr-demo-2', 'Nexus Analytics Integration', 180000.00, 'INR', 'NEGOTIATION', 80, '2026-09-30', 'comp-2', 'cont-2'),
('deal-3', 'org-demo-1', 'usr-demo-3', 'Innova Lab CRM Deployment', 95000.00, 'INR', 'WON', 100, '2026-08-30', 'comp-3', 'cont-3')
;

-- 8. Tasks
INSERT INTO tasks (id, organization_id, assigned_user_id, title, description, due_date, priority, status, related_entity_type, related_entity_id)
VALUES
('task-1', 'org-demo-1', 'usr-demo-1', 'Send revised quote to David Kovac', 'Include multi-tenant SSO add-on pricing.', '2026-09-06 10:30:00', 'HIGH', 'TODO', 'DEAL', 'deal-1'),
('task-2', 'org-demo-1', 'usr-demo-2', 'Schedule security compliance review', 'Prepare SOC2 and ISO27001 summary.', '2026-09-07 14:00:00', 'MEDIUM', 'TODO', 'DEAL', 'deal-2'),
('task-3', 'org-demo-1', 'usr-demo-3', 'Deliver onboarding package', 'Send API docs and credentials.', '2026-09-04 16:00:00', 'URGENT', 'COMPLETED', 'DEAL', 'deal-3')
;

-- 9. Products Catalog
INSERT INTO products (id, organization_id, name, code, category, price, currency, description, is_active)
VALUES
('prod-1', 'org-demo-1', 'Nexus CRM Enterprise Plan', 'CRM-ENT', 'Subscription', 25000.00, 'INR', 'Annual seat subscription with multi-tenancy.', true),
('prod-2', 'org-demo-1', 'Tauri Desktop Client Addon', 'DESK-NATIVE', 'Addon', 5000.00, 'INR', 'Offline-first desktop synchronization client.', true),
('prod-3', 'org-demo-1', 'Mobile Field Sync Suite', 'MOB-SYNC', 'Addon', 3500.00, 'INR', 'React Native field sales mobile app.', true)
;

-- 10. Invoices & Payments
INSERT INTO invoices (id, organization_id, invoice_number, company_id, contact_id, deal_id, amount, currency, status, due_date)
VALUES
('inv-1', 'org-demo-1', 'INV-2026-001', 'comp-3', 'cont-3', 'deal-3', 95000.00, 'INR', 'PAID', '2026-09-01')
;

INSERT INTO invoice_items (id, invoice_id, product_id, description, quantity, unit_price, amount)
VALUES
('item-1', 'inv-1', 'prod-1', 'Nexus CRM Enterprise Plan', 3, 25000.00, 75000.00),
('item-2', 'inv-1', 'prod-2', 'Tauri Desktop Client Addon', 4, 5000.00, 20000.00)
;

INSERT INTO payments (id, organization_id, invoice_id, amount, payment_date, payment_method, transaction_id, status)
VALUES
('pay-1', 'org-demo-1', 'inv-1', 95000.00, '2026-09-02 11:00:00', 'BANK_TRANSFER', 'TXN-99882211', 'SUCCESS')
;

-- 11. Notifications
INSERT INTO notifications (id, organization_id, user_id, title, message, is_read)
VALUES
('notif-1', 'org-demo-1', 'usr-demo-1', 'New Qualified Lead', 'Rahul Sharma submitted a website inquiry.', false),
('notif-2', 'org-demo-1', 'usr-demo-1', 'Deal Won 🎉', 'Innova Lab CRM Deployment marked as WON.', true)
;

-- 12. Calendar Events
INSERT INTO calendar_events (id, organization_id, user_id, title, description, start_time, end_time, type, status, location)
VALUES
('cal-1', 'org-demo-1', 'usr-demo-1', 'Executive Demo with CTO David Kovac', 'Present architecture and offline capabilities.', '2026-09-06 10:00:00', '2026-09-06 11:00:00', 'MEETING', 'SCHEDULED', 'Google Meet'),
('cal-2', 'org-demo-1', 'usr-demo-2', 'Follow-up Call with Rachel Green', 'Discuss FinTech compliance add-ons.', '2026-09-07 14:30:00', '2026-09-07 15:30:00', 'CALL', 'SCHEDULED', 'Phone')
;
