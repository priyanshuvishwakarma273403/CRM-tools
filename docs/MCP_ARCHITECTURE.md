# CRM OS — Model Context Protocol (MCP) Specification

## 1. Overview & Vision

The **Model Context Protocol (MCP)** is an open standard that allows applications to safely provide context and tools to Large Language Models.
CRM OS implements MCP natively across three critical architectural roles:

1. **CRM MCP Server**: Exposes internal CRM capabilities safely to external AI tools (Claude Desktop, Cursor, custom LLM agents).
2. **MCP Client**: Allows CRM users and agents to discover and invoke tools hosted on external MCP servers (Gmail, GitHub, Slack, Notion, Jira).
3. **MCP Gateway & Control Plane**: The centralized security governor enforcing tenant isolation, role-based tool permissions, user confirmation for destructive actions, and immutable audit logging.

```
┌────────────────────────────────┐                    ┌────────────────────────────────┐
│      External MCP Clients      │                    │     External MCP Servers       │
│  (Claude Desktop, Cursor, IDE) │                    │  (Gmail, GitHub, Slack, Jira)  │
└───────────────┬────────────────┘                    └────────────────▲───────────────┘
                │ Tool Discovery & Call                                │ Tool Execution
                ▼                                                      │
        ═════════════════════════════════════════════════════════════════════
                              CENTRALIZED MCP GATEWAY
             ┌────────────────────────────────────────────────────────┐
             │ 1. Tenant Authentication & Identity Context           │
             │ 2. Tool Registry & JSON Schema Discovery               │
             │ 3. RBAC Policy & Permission Enforcement                │
             │ 4. Destructive Action Confirmation Guard               │
             │ 5. Rate Limiting & Timeout Circuit Breaking            │
             │ 6. Immutable MCP Audit Trail (mcp_audit_logs)          │
             └────────────────────────────────────────────────────────┘
        ═════════════════════════════════════════════════════════════════════
                │
                ▼
┌────────────────────────────────┐
│      Built-in CRM Tools        │
│ • crm.search_customer          │
│ • crm.get_customer_360         │
│ • crm.create_deal              │
│ • crm.get_sales_report         │
└────────────────────────────────┘
```

---

## 2. CRM MCP Server (Exposing CRM to AI)

CRM OS exposes standardized MCP tool definitions over HTTP and Server-Sent Events (SSE):
* **Discovery Endpoint**: `GET /api/v1/mcp/tools`
* **Execution Endpoint**: `POST /api/v1/mcp/execute`

### 2.1 Standard Built-in CRM Tools
| Tool Identifier | Description | Destructive | Requires Confirmation |
| :--- | :--- | :--- | :--- |
| `crm.search_customer` | Query customers by name keyword, status, or tag | False | False |
| `crm.get_customer_360` | Retrieve complete Customer 360 profile & timeline | False | False |
| `crm.create_customer` | Provision a new customer account | False | False |
| `crm.search_lead` | Search sales leads by status, company, score | False | False |
| `crm.create_lead` | Add a new inbound lead | False | False |
| `crm.get_deal` | Fetch opportunity details and current stage | False | False |
| `crm.create_deal` | Add opportunity to sales pipeline | False | **True** |
| `crm.create_task` | Schedule follow-up task or reminder | False | False |
| `crm.get_sales_report` | Aggregate pipeline KPIs, win rate, and ARR | False | False |

### 2.2 JSON Schema Tool Definition Example
```json
{
  "name": "crm.create_deal",
  "description": "Create a new deal opportunity in the pipeline",
  "inputSchema": {
    "type": "object",
    "properties": {
      "title": { "type": "string", "description": "Title of the opportunity" },
      "value": { "type": "number", "description": "Deal monetary value" },
      "stage": { "type": "string", "description": "NEW, QUALIFIED, DEMO, PROPOSAL, NEGOTIATION, WON, LOST" },
      "probability": { "type": "integer", "description": "Probability percentage (0-100)" }
    },
    "required": ["title", "value"]
  },
  "destructive": false,
  "requireConfirmation": true,
  "source": "BUILTIN"
}
```

---

## 3. MCP Client (Connecting External Tools)

CRM OS allows organizations to connect third-party MCP servers via HTTP/SSE or local stdio:
* **Server Registry (`mcp_servers`)**: Stores server URL, display name, connection status (`CONNECTED`, `ERROR`, `DISCONNECTED`), and encrypted OAuth/bearer tokens.
* **Dynamic Tool Ingestion**: When an external server connects, CRM OS queries `tools/list` and registers the external tools into `mcp_tool_definitions` bound to the server ID.

---

## 4. MCP Gateway & Security Control Plane

### 4.1 Permission Engine (`mcp_tool_permissions`)
Administrators configure tool access per tenant and role:
* **Permission Levels**:
  - `EXECUTE`: Role is permitted to run the tool.
  - `DENIED`: Execution is blocked immediately (`PERMISSION_DENIED`).
* **Confirmation Override**: Administrators can enforce `require_confirmation = true` on any tool, overriding default settings.

### 4.2 Destructive Action Confirmation Guard
If an AI agent attempts to invoke a tool that modifies state and requires confirmation:
1. The Gateway halts execution and responds with:
   ```json
   {
     "tool": "crm.create_deal",
     "status": "CONFIRMATION_REQUIRED",
     "requiresConfirmation": true,
     "confirmationPrompt": "Action 'crm.create_deal' modifies system data. Please confirm execution to proceed."
   }
   ```
2. The UI renders an interactive confirmation dialog with the exact proposed parameter payload.
3. Only upon receiving `confirmed: true` from the user will the action dispatch.

---

## 5. Immutable MCP Audit Trail (`mcp_audit_logs`)

Every MCP tool invocation—regardless of origin—generates an immutable audit record:
* `id`: Unique execution UUID
* `organization_id`: Tenant context
* `user_id`: Authenticated user or `null` if system-level
* `tool_name`: Invoked tool identifier
* `input_json`: Serialized parameter payload
* `output_json`: Serialized result or error message
* `status`: `SUCCESS`, `ERROR`, `CONFIRMATION_REQUIRED`, or `PERMISSION_DENIED`
* `execution_time_ms`: Processing latency
* `created_at`: Immutable timestamp

Audit logs can be searched, filtered, and exported from the Admin Governance Center.
