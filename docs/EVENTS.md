# CRM OS — Event-Driven Architecture & Kafka Specification

## 1. Event Strategy & Decoupling

CRM OS utilizes asynchronous event streaming to decouple core transactional operations from background processing, notifications, audit logging, search indexing, and webhook dispatching:
* **Synchronous REST / Transactions**: For critical user-facing transactions (saving a deal, updating user credentials, creating invoices) where immediate write confirmation is required.
* **Asynchronous Event Bus**: For downstream side effects (cache invalidation, real-time WebSocket broadcasting, AI scoring, email dispatch, third-party webhook push, activity timeline updates).

---

## 2. Event Specification: CloudEvents 1.0

All system events conform to the standard **CloudEvents v1.0** schema:

```json
{
  "specversion": "1.0",
  "id": "evt_9a8b7c6d-5e4f-3a2b-1c0d-e9f8a7b6c5d4",
  "source": "/services/crm-core",
  "type": "crm.deal.stage_changed",
  "datacontenttype": "application/json",
  "time": "2026-09-05T12:00:00Z",
  "tenant_id": "org_enterprise_101",
  "correlation_id": "corr_3f82a10b492c",
  "data": {
    "deal_id": "deal_7781",
    "previous_stage": "PROPOSAL",
    "current_stage": "WON",
    "value": 250000.00,
    "owner_id": "user_456"
  }
}
```

---

## 3. Canonical Event Catalog

### 3.1 Core CRM Domain Events
| Event Type | Producer | Description |
| :--- | :--- | :--- |
| `crm.customer.created` | Customer Service | Published when a new account is provisioned |
| `crm.customer.updated` | Customer Service | Published on profile or health score modification |
| `crm.lead.created` | Lead Service | Inbound lead captured; triggers AI enrichment & webhook |
| `crm.lead.status_changed` | Lead Service | Stage update; triggers automated email sequences |
| `crm.deal.created` | Deal Service | New opportunity added to pipeline |
| `crm.deal.stage_changed` | Deal Service | Kanban drag-and-drop; recalculates forecast models |
| `crm.deal.won` | Deal Service | Closed won opportunity; triggers invoice generation |
| `crm.task.completed` | Task Service | Action item resolved; updates productivity metrics |
| `crm.invoice.paid` | Finance Service | Payment confirmed; updates ARR and Customer 360 |

### 3.2 AI & Automation Events
| Event Type | Producer | Description |
| :--- | :--- | :--- |
| `ai.scoring.completed` | AI Service | Predictive lead score and conversion probability computed |
| `ai.deal_risk.flagged` | AI Service | Stagnation or competitor detected; triggers executive alert |
| `ai.action.recommended` | Multi-Agent Mesh | Specialized agent proposes action requiring approval |
| `ai.approval.decision` | Approval Service | User approves/rejects proposed AI action |

### 3.3 MCP & Security Events
| Event Type | Producer | Description |
| :--- | :--- | :--- |
| `mcp.tool.invoked` | MCP Gateway | Tool execution requested by AI or external client |
| `mcp.tool.completed` | MCP Gateway | Tool execution finished; records execution time and status |
| `auth.session.created` | Auth Service | New device session logged in |
| `auth.session.revoked` | Auth Service | Session invalidated; token added to Redis blacklist |

---

## 4. Consumer Architecture & Delivery Guarantees

```
 [Spring Boot Core] 
         │
         ▼
 [Kafka Topics: crm.events.*] 
         │
         ├──► [Consumer: WebSocket Realtime Broadcaster (/topic/events)]
         ├──► [Consumer: Webhook Dispatcher (HMAC Sign + HTTP POST)]
         ├──► [Consumer: Search Engine Indexer (Vector & Keyword Index)]
         └──► [Consumer: AI Background Scorer (Async Lead & Deal Risk)]
```

### 4.1 Delivery Guarantees & Idempotency
1. **At-Least-Once Delivery**: Kafka consumers commit offsets only after processing the event block successfully.
2. **Idempotency Keys**: Consumers track `event.id` in Redis for 24 hours to deduplicate incoming messages:
   ```text
   SETNX idempotency:event:{event_id} 1 EX 86400
   ```
3. **Dead-Letter Queue (DLQ)**:
   - Events failing after 3 exponential backoff attempts (1s, 5s, 25s) are forwarded to topic `crm.events.dlq`.
   - Administrators can review, replay, or discard failed messages from the Admin Governance Center.
