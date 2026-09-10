# CRM OS — Database & Persistence Architecture Specification

## 1. Relational Database Strategy: Dual-Engine Portability

CRM OS adopts a dual-engine relational persistence strategy that guarantees compatibility with both **PostgreSQL 16** and **MySQL 8**, with seamless support for **H2** in automated test suites:
* **Strict ANSI SQL Standards**: All schema migrations in `database/migrations/` avoid vendor-specific proprietary syntax (e.g. avoiding non-standard `ON CONFLICT` in favor of portable joins or JPA merges; quoting reserved identifiers properly like `"value"`).
* **Flyway Migration Engine**: Automated versioned schema management running at Spring Boot application startup (`spring.flyway.enabled: true`).

---

## 2. Flyway Migration Version History

```
  V1: Canonical Schema (Core CRM tables)
        │
        ▼
  V2: Enterprise Seed Data (Roles, Demo Organization, Accounts)
        │
        ▼
  V3: Enterprise Extensions (Workflows, Audit Logs, Custom Fields)
        │
        ▼
  V4: CRM OS Foundation (Passkeys, Sessions, MCP, AI Memory, API Keys, Webhooks)
```

### 2.1 Schema Breakdown by Migration
| Version | Filename | Tables Created | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **V1** | `V1__canonical_schema.sql` | 14 | `organizations`, `users`, `roles`, `customers`, `contacts`, `companies`, `leads`, `deals`, `tasks`, `activities`, `communications`, `invoices`, `products` |
| **V2** | `V2__seed_data.sql` | — | Seed default enterprise tenant, admin/manager accounts, and initial sales pipeline |
| **V3** | `V3__enterprise_extensions.sql` | 6 | `audit_logs`, `workflow_rules`, `custom_field_definitions`, `custom_field_values`, `email_templates` |
| **V4** | `V4__crm_os_foundation.sql` | 12 | `user_identities`, `passkey_credentials`, `user_sessions`, `sso_configurations`, `mcp_servers`, `mcp_tool_definitions`, `mcp_tool_permissions`, `mcp_audit_logs`, `ai_memories`, `knowledge_documents`, `api_keys`, `webhooks`, `webhook_deliveries` |

---

## 3. Core Relational Entities & Indexing

### 3.1 Tenant Isolation & Indexing Rules
Every tenant-scoped table enforces strict indexing to ensure sub-millisecond query execution:
1. **Primary Key**: UUID string (`VARCHAR(36)`), client-safe and distributed-friendly.
2. **Tenant Foreign Key**: `organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE`.
3. **Compound Tenant Indexes**:
   - `idx_{table}_org_created`: `CREATE INDEX ON {table} (organization_id, created_at DESC);`
   - `idx_{table}_org_status`: `CREATE INDEX ON {table} (organization_id, status);`
   - `idx_sessions_token_hash`: Fast $O(1)$ token hash lookup for session checks.
   - `idx_api_keys_hash`: Fast SHA-256 hash lookup for developer API authentication.

---

## 4. Redis Cache & Distributed Lock Architecture

Redis 7 is deployed as an in-memory acceleration layer, strictly decoupled from the primary permanent source of truth:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        REDIS DATA TOPOLOGIES                           │
├──────────────────────────┬─────────────────────────────┬───────────────┤
│ Key Pattern              │ Data Type                   │ TTL / Purpose │
├──────────────────────────┼─────────────────────────────┼───────────────┤
│ revoked:token:{hash}     │ String ("true")             │ 24 Hours (JWT)│
│ rate:api:{key_id}:{min}  │ Integer (INCR)              │ 60 Seconds    │
│ lock:deal:{deal_id}      │ Distributed Lock (Redlock)  │ 5 Seconds     │
│ cache:c360:{customer_id} │ JSON String                 │ 5 Minutes     │
│ session:user:{user_id}   │ Hash (Device Metadata)      │ 7 Days        │
└──────────────────────────┴─────────────────────────────┴───────────────┘
```

* **Idempotency**: Webhook deliveries and Kafka consumers utilize Redis `SETNX` to prevent duplicate processing.
* **Resilience**: If Redis is unreachable, the Spring Boot backend gracefully falls back to direct database verification with circuit-breaking.

---

## 5. Vector Database & Semantic Search Architecture

* **Engine**: pgvector (PostgreSQL extension) or ChromaDB / Milvus for vector embeddings.
* **Embedding Model**: 384-dimensional (`all-MiniLM-L6-v2`) or 768-dimensional (`text-embedding-3-small`) vectors.
* **Mandatory Metadata Partitioning**:
  All vector points store:
  ```json
  {
    "id": "chunk_uuid_881",
    "organization_id": "org_enterprise_101",
    "document_id": "doc_sla_compliance_pdf",
    "access_roles": ["ADMIN", "MANAGER", "SALES_AGENT"],
    "created_at": 1757059200
  }
  ```
  Vector search queries must inject `filter: { organization_id: current_tenant }` to strictly prohibit cross-tenant semantic data retrieval.
