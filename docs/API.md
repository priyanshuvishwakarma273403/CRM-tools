# CRM OS — Master API Specification

## 1. REST API Design Standards

All endpoints in CRM OS adhere strictly to standard RESTful conventions, semantic HTTP verbs, and consistent JSON serialization:
* **Base Path**: `/api/v1`
* **Content Negotiation**: `application/json; charset=UTF-8`
* **Correlation IDs**: All requests accept or automatically receive a unique `X-Correlation-ID` header for end-to-end distributed tracing across the Spring Boot backend and satellite services.
* **Authentication**: Delivered via `Authorization: Bearer <jwt_access_token>` or `X-API-Key: crm_live_<token>`.

---

## 2. Standard Envelopes

### 2.1 Single Resource Envelope (`ApiResponse<T>`)
```json
{
  "success": true,
  "data": { ... },
  "message": "Resource loaded successfully",
  "timestamp": "2026-09-05T12:00:00.000Z"
}
```

### 2.2 Paginated Resource Envelope (`PageResponse<T>`)
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "page": 0,
    "size": 20,
    "totalElements": 142,
    "totalPages": 8,
    "first": true,
    "last": false
  },
  "message": "Page loaded successfully",
  "timestamp": "2026-09-05T12:00:00.000Z"
}
```

### 2.3 Error Response Envelope
```json
{
  "success": false,
  "message": "Validation failed on fields [email, name]",
  "code": "BAD_REQUEST",
  "timestamp": "2026-09-05T12:00:00.000Z"
}
```

---

## 3. Comprehensive Endpoint Catalog

### 3.1 Authentication & Identity (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user via email/password; returns JWT pair | No |
| `POST` | `/api/v1/auth/register` | Provision new tenant organization and initial admin user | No |
| `POST` | `/api/v1/auth/refresh` | Exchange valid refresh token for new access token | No |
| `POST` | `/api/v1/auth/logout` | Invalidate current session and blacklist token in Redis | Yes |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile and roles | Yes |
| `GET` | `/api/v1/auth/sessions` | List active device sessions for current user | Yes |
| `DELETE`| `/api/v1/auth/sessions/{id}` | Remotely revoke a device session | Yes |
| `POST` | `/api/v1/auth/sessions/revoke-others` | Revoke all sessions except the active caller | Yes |
| `GET` | `/api/v1/auth/passkey` | List registered FIDO2 / WebAuthn passkeys | Yes |
| `GET` | `/api/v1/auth/passkey/register/challenge` | Generate WebAuthn registration challenge | Yes |
| `POST` | `/api/v1/auth/passkey/register/verify` | Verify and persist new passkey credential | Yes |
| `GET` | `/api/v1/auth/passkey/login/challenge` | Generate WebAuthn authentication challenge | No |
| `POST` | `/api/v1/auth/passkey/login/verify` | Authenticate via passkey signature | No |

### 3.2 Core CRM Platform
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/customers` | Paginated customer accounts for tenant |
| `GET` | `/api/v1/customers/{id}` | Customer account details |
| `GET` | `/api/v1/customers/{id}/360`| Unified Customer 360 profile (contacts, deals, timeline, health) |
| `POST` | `/api/v1/customers` | Create new customer account |
| `PUT` | `/api/v1/customers/{id}` | Update customer record |
| `DELETE`| `/api/v1/customers/{id}` | Delete customer account |
| `GET` | `/api/v1/leads` | Paginated sales leads |
| `POST` | `/api/v1/leads` | Create new inbound lead |
| `PUT` | `/api/v1/leads/{id}/status` | Update lead qualification stage |
| `GET` | `/api/v1/deals` | Active pipeline deals |
| `POST` | `/api/v1/deals` | Create new deal opportunity |
| `PUT` | `/api/v1/deals/{id}/stage` | Update Kanban deal stage |
| `GET` | `/api/v1/tasks` | Task action items with priority and due date |
| `POST` | `/api/v1/tasks` | Schedule task |
| `PUT` | `/api/v1/tasks/{id}/complete`| Mark task as completed |
| `GET` | `/api/v1/reports/dashboard` | Aggregated executive KPIs, win rate, and total pipeline revenue |

### 3.3 Model Context Protocol (MCP) Platform (`/api/v1/mcp`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/mcp/tools` | List registered MCP tools with JSON Schemas |
| `POST` | `/api/v1/mcp/execute` | Execute tool call with policy checks and immutable audit |
| `GET` | `/api/v1/mcp/servers` | List registered external MCP servers |
| `POST` | `/api/v1/mcp/servers` | Connect new external MCP server (HTTP/SSE) |
| `DELETE`| `/api/v1/mcp/servers/{id}` | Remove connected MCP server |
| `GET` | `/api/v1/mcp/permissions` | List configured tool execution policies |
| `POST` | `/api/v1/mcp/permissions` | Update confirmation and role policies for tool |
| `GET` | `/api/v1/mcp/audit` | Query immutable tool execution audit logs |

### 3.4 AI Platform & "Ask My CRM" (`/api/v1/ai`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/ai/lead-score` | Predict lead conversion probability and assign grade |
| `POST` | `/api/v1/ai/deal-risk` | Detect deal stagnation, competitor threats, and mitigation steps |
| `POST` | `/api/v1/ai/copilot` | Natural language sales copilot query with action shortcuts |
| `POST` | `/api/v1/ai/email-draft` | Generate personalized email templates with variable tone |
| `POST` | `/api/v1/ai/agent/execute` | Dispatch task to multi-agent mesh (Sales, Support, Marketing, Finance, Research) |
| `POST` | `/api/v1/ai/agent/{agentType}`| Execute specific domain agent directly |
| `POST` | `/api/v1/ai/ask-crm` | Safe read-only natural language SQL analytics synthesis |

### 3.5 Developer Platform (`/api/v1/developer`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/developer/api-keys` | List active REST API keys for current tenant |
| `POST` | `/api/v1/developer/api-keys` | Generate new API key with rate limits and scopes (exposes raw secret once) |
| `DELETE`| `/api/v1/developer/api-keys/{id}` | Revoke active API key |
| `GET` | `/api/v1/developer/webhooks` | List webhook subscriptions |
| `POST` | `/api/v1/developer/webhooks` | Register new webhook endpoint |
| `DELETE`| `/api/v1/developer/webhooks/{id}`| Remove webhook subscription |
| `POST` | `/api/v1/developer/webhooks/{id}/test` | Send test ping event to verify reachability |
| `GET` | `/api/v1/developer/webhooks/{id}/deliveries`| View delivery history and HTTP response codes |
