# CRM OS — Security & Identity Specification

## 1. Core Security Principles

CRM OS is designed under a strict **Zero Trust** architecture:
* **Never Trust, Always Verify**: Every request—whether originating from the Web, Desktop, Mobile, an external MCP client, an AI agent, or a webhook—must be authenticated and authorized.
* **Least Privilege**: Users, integrations, and autonomous agents receive only the minimum scopes necessary to fulfill their assigned tasks.
* **Defense in Depth**: Security controls are applied across network boundaries, application filters, service layers, and database queries.
* **Fail Securely**: In the event of an identity service timeout or rule evaluation failure, access is denied by default.

---

## 2. Unified Identity Platform (IAM)

### 2.1 Authentication Mechanisms
1. **FIDO2 / WebAuthn Passkeys**:
   - Passwordless biometric authentication using device authenticators (Windows Hello, Touch ID, Face ID, YubiKey).
   - Challenge-response verification stored in `passkey_credentials` with cryptographic signature verification and sign-count tracking to mitigate cloned credential attacks.
2. **Social OAuth 2.0 & OpenID Connect**:
   - Federated identity support for Google, Microsoft, and GitHub.
   - Provider tokens are securely encrypted and mapped to internal user records in `user_identities`.
3. **Enterprise SAML 2.0 / OIDC SSO**:
   - Enterprise single sign-on configured per tenant in `sso_configurations`.
   - Supports corporate IdPs (Okta, Azure AD, PingFederate) with automatic user provisioning and role mapping.
4. **JWT Dual-Token Architecture**:
   - Short-lived Access Tokens (15–60 minutes) containing `userId`, `organizationId`, `role`, and `scopes`.
   - Long-lived Refresh Tokens (7 days) stored securely with token rotation upon each exchange.

### 2.2 Multi-Device Session Management & Remote Revocation
* Every user login generates a unique record in `user_sessions` tracking IP address, user-agent string, parsed device type (`WEB`, `DESKTOP`, `MOBILE`), operating system, and geographic location.
* **Instant Remote Revocation**:
  - Users or security administrators can revoke individual sessions or trigger "Revoke All Other Sessions".
  - The SHA-256 hash of the revoked session token is pushed to Redis with an expiration matching the token's lifetime:
    ```text
    SET revoked:token:{token_hash} "true" EX 86400
    ```
  - `JwtAuthenticationFilter` performs an $O(1)$ lookup against Redis before granting request execution.

---

## 3. Authorization: RBAC & ABAC

The system employs a hybrid authorization model combining Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC):

```
                                 INCOMING REQUEST
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │  Tenant Context Resolution  │
                         │  (TenantContext.set(orgId)) │
                         └──────────────┬──────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │      Role-Based Check       │
                         │  (ADMIN, MANAGER, AGENT)    │
                         └──────────────┬──────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │   Attribute-Based Policies  │
                         │ • Record Ownership          │
                         │ • Department / Team Scope   │
                         │ • Field-Level Sensitivity   │
                         └──────────────┬──────────────┘
                                        │
                                        ▼
                                AUTHORIZED QUERY
```

### 3.1 Standard Role Hierarchy
- **ADMIN**: Full control over tenant configurations, user provisioning, security policies, MCP tool permissions, and billing.
- **MANAGER**: Full visibility into team pipeline, aggregated reports, deal stages, and task assignments.
- **SALES_AGENT**: Access restricted to assigned leads, opportunities, contacts, and personal tasks.
- **SUPPORT_AGENT**: Access restricted to customer support tickets, communication logs, and Customer 360 profiles.
- **FINANCE_AGENT**: Access restricted to invoices, payments, and revenue analytics.

### 3.2 Strict Multi-Tenant Isolation
* Every core business entity contains a mandatory `organization_id` foreign key.
* The `TenantContext` thread-local filter populates the tenant identity from validated JWT claims.
* All database repository queries enforce tenant isolation at the query level (e.g. `findAllByOrganizationId(...)`).
* Cross-tenant data leakage is strictly prohibited across relational data, Redis cache keys, search indexes, AI memory, and vector stores.

---

## 4. AI Context Firewall & DLP (Data Loss Prevention)

Before customer data is transmitted to external LLM providers (e.g., OpenAI, Anthropic), it must pass through the **AI Context Firewall**:

1. **PII Detection & Masking**:
   - Automatically identifies and redacts sensitive data using regex and NER (Named Entity Recognition):
     - Credit card numbers (Luhn check validation)
     - Social security numbers / National IDs
     - Authentication credentials, API keys, passwords
     - Personal contact information (when restricted by privacy policy)
2. **Data Minimization**:
   - Strips non-essential customer context, forwarding only the fields required to satisfy the specific prompt intent.
3. **Tenant Privacy Boundaries**:
   - Enforces tenant-level AI configurations (e.g. prohibiting third-party LLM transmission for enterprise accounts requiring private in-VPC models).

---

## 5. MCP Security & Governance Pipeline

To prevent autonomous AI models from executing unauthorized or catastrophic actions, the **MCP Gateway** enforces an immutable 8-step security verification pipeline:

```
[Prompt Intent] ──► [Tool Validation] ──► [Tenant Isolation] ──► [Role Policy]
                                                                        │
                                                                        ▼
[Immutable Audit] ◄── [Execution] ◄── [Approval Guard] ◄── [Risk Classification]
```

1. **Tool Allowlist**: The tool must be registered in `mcp_tool_definitions` and marked as allowed.
2. **Permission Check**: The user's role must possess explicit `EXECUTE` privileges in `mcp_tool_permissions`.
3. **Risk Classification**: Tools flagged with `is_destructive = true` (e.g. deleting customer records, modifying financial quotes) require explicit user confirmation.
4. **Approval Guard**: The gateway halts execution and issues a `CONFIRMATION_REQUIRED` challenge until the user explicitly confirms the intent.
5. **Immutable Audit Logging**: Every invocation, parameter payload, execution duration, and result status is recorded permanently in `mcp_audit_logs`.

---

## 6. Cryptographic Standards & Data Protection

| Domain | Standard / Algorithm | Application |
| :--- | :--- | :--- |
| **Data in Transit** | TLS 1.3 / HTTPS / WSS | All client-to-backend and service-to-service communication. |
| **Data at Rest** | AES-256-GCM | Database storage, object storage, and sensitive credentials in DB. |
| **User Passwords** | BCrypt (Work Factor 12) | Irreversible salted password hashing. |
| **API Secret Keys** | SHA-256 Hashing | Raw keys formatted as `crm_live_...` with hash stored in DB. |
| **Webhook Signatures**| HMAC-SHA256 | Signature delivered via `X-CRM-Signature: sha256={hash}`. |
| **Session Invalidation**| Redis Revocation Set | Instant token hash blacklisting with TTL. |
