-- V4: CRM Operating System (CRM OS) Foundation
-- Unified Identity (Passkeys, SSO, Sessions), MCP Servers & Tools, Multi-Agent AI Memory, Knowledge Base, API Keys, Webhooks

-- 1. Unified Identity & Linked Accounts
CREATE TABLE IF NOT EXISTS user_identities (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    access_token_enc TEXT,
    refresh_token_enc TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_identities_user ON user_identities(user_id);
CREATE INDEX IF NOT EXISTS idx_identities_provider ON user_identities(provider, provider_user_id);

-- 2. Passkey / WebAuthn Credentials (FIDO2)
CREATE TABLE IF NOT EXISTS passkey_credentials (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    credential_id VARCHAR(500) NOT NULL UNIQUE,
    public_key_cose TEXT NOT NULL,
    sign_count BIGINT DEFAULT 0,
    aaguid VARCHAR(100),
    device_name VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_passkeys_user ON passkey_credentials(user_id);

-- 3. Device Sessions & Remote Revocation Management
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL,
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    device_type VARCHAR(50) DEFAULT 'WEB',
    os VARCHAR(100),
    location VARCHAR(150),
    is_revoked BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON user_sessions(token_hash);

-- 4. Enterprise SSO Configurations (SAML / OIDC)
CREATE TABLE IF NOT EXISTS sso_configurations (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    provider_type VARCHAR(50) NOT NULL,
    idp_entity_id VARCHAR(255),
    idp_sso_url VARCHAR(500),
    idp_x509_cert TEXT,
    client_id VARCHAR(255),
    client_secret_enc TEXT,
    discovery_url VARCHAR(500),
    is_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sso_org ON sso_configurations(organization_id);

-- 5. MCP External Servers Registry
CREATE TABLE IF NOT EXISTS mcp_servers (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    server_url VARCHAR(500) NOT NULL,
    transport_type VARCHAR(50) DEFAULT 'HTTP_SSE',
    auth_token_enc TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'CONNECTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_mcp_servers_org ON mcp_servers(organization_id);

-- 6. MCP Tool Definitions
CREATE TABLE IF NOT EXISTS mcp_tool_definitions (
    id VARCHAR(36) PRIMARY KEY,
    server_id VARCHAR(36) REFERENCES mcp_servers(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    input_schema_json TEXT,
    is_destructive BOOLEAN DEFAULT FALSE,
    is_allowed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_mcp_tools_name ON mcp_tool_definitions(name);

-- 7. MCP Permissions & Security Governance
CREATE TABLE IF NOT EXISTS mcp_tool_permissions (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role_id VARCHAR(36) REFERENCES roles(id) ON DELETE CASCADE,
    tool_name VARCHAR(100) NOT NULL,
    permission_level VARCHAR(50) DEFAULT 'EXECUTE',
    require_confirmation BOOLEAN DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_mcp_perm_org ON mcp_tool_permissions(organization_id);

-- 8. Immutable MCP Audit Trail
CREATE TABLE IF NOT EXISTS mcp_audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    tool_name VARCHAR(100) NOT NULL,
    input_json TEXT,
    output_json TEXT,
    status VARCHAR(50) NOT NULL,
    execution_time_ms BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_mcp_audit_org_time ON mcp_audit_logs(organization_id, created_at);

-- 9. AI Memory Store (Tenant-Isolated Context)
CREATE TABLE IF NOT EXISTS ai_memories (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    memory_key VARCHAR(100) NOT NULL,
    memory_value TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'PREFERENCE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ai_memory_user ON ai_memories(organization_id, user_id);

-- 10. RAG Knowledge Base Documents
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_type VARCHAR(50) DEFAULT 'TXT',
    chunk_count INT DEFAULT 0,
    access_roles VARCHAR(255) DEFAULT 'ALL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_knowledge_org ON knowledge_documents(organization_id);

-- 11. Developer Platform API Keys
CREATE TABLE IF NOT EXISTS api_keys (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(64) NOT NULL UNIQUE,
    key_prefix VARCHAR(10) NOT NULL,
    scopes VARCHAR(500) DEFAULT 'read:all',
    rate_limit_per_minute INT DEFAULT 120,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_org ON api_keys(organization_id);

-- 12. Webhook Subscriptions & Deliveries
CREATE TABLE IF NOT EXISTS webhooks (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    secret VARCHAR(255) NOT NULL,
    subscribed_events_json TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_webhooks_org ON webhooks(organization_id);

CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id VARCHAR(36) PRIMARY KEY,
    webhook_id VARCHAR(36) NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload_json TEXT,
    status_code INT,
    attempts INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING',
    delivered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries ON webhook_deliveries(webhook_id, delivered_at);
