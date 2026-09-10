# CRM OS — Master Enterprise Architecture Specification

## 1. Executive Vision & System Purpose

**CRM OS** is an AI-native **Business Operating System** that unifies customer relationships, autonomous AI agent meshes, Model Context Protocol (MCP) tooling, multichannel communication, and workflow automation into a single authoritative platform.

Unlike legacy CRUD CRMs, CRM OS acts as an operational nervous system for modern enterprises:
* **Centralized Intelligence**: Customer 360 unified timeline, predictive lead scoring, deal risk detection, and natural language business analytics ("Ask My CRM").
* **Autonomous & Assisted AI**: Multi-agent mesh (Sales, Support, Marketing, Finance, Research) with sandboxed execution, shadow mode, and human-in-the-loop approvals.
* **Open Extensibility**: Standardized MCP Client, MCP Gateway, and CRM MCP Server enabling seamless interaction with external AI models, developer APIs, and third-party integrations.

---

## 2. Core Architectural Principles (Non-Negotiable)

The architecture strictly adheres to seven foundational invariants:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SEVEN SYSTEM INVARIANTS                         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. ONE CENTRALIZED BACKEND   : Spring Boot 3.2 on /api/v1               │
│ 2. ONE SOURCE OF TRUTH       : Central Relational DB (PostgreSQL/MySQL)│
│ 3. ONE IDENTITY SYSTEM       : Central IAM (Passkeys, OAuth2, SSO)     │
│ 4. ONE AUTHORIZATION MODEL   : Unified RBAC + ABAC + Tenant Isolation   │
│ 5. ONE AUDIT PLATFORM        : Immutable audit log across AI, MCP, DB  │
│ 6. ONE DATA PLATFORM         : Synchronized transactional & cache state│
│ 7. ONE EVENT ARCHITECTURE    : Kafka / CloudEvents asynchronous bus    │
└────────────────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Zero Client Duplication Rule**: Web, Desktop, Android, and iOS clients are strictly presentation layers. They contain zero duplicated business logic, zero local business databases, and communicate exclusively via the centralized REST (`/api/v1/*`) and WebSocket/SSE APIs.

---

## 3. High-Level Logical Topology

```
                                  CLIENT LAYER
        ┌───────────────────┬───────────────────┬───────────────────┐
        │  Web Application  │  Desktop Client   │    Mobile Apps    │
        │  (React 18 / Vite)│  (Tauri 2 / Rust) │ (Android / iOS)   │
        └─────────┬─────────┴─────────┬─────────┴─────────┬─────────┘
                  │                   │                   │
                  └───────────────────┼───────────────────┘
                                      │ HTTPS / WSS / JWT
                                      ▼
                        ┌───────────────────────────┐
                        │   Edge & Ingress Gateway  │
                        │ Rate Limit • SSL • Helmet │
                        └─────────────┬─────────────┘
                                      │
                                      ▼
    ═════════════════════════════════════════════════════════════════════════
                         PRIMARY BACKEND CORE (Java 17)
                         Spring Boot 3.2.3 Ecosystem
    ─────────────────────────────────────────────────────────────────────────
     • Core CRM (Customers, Leads, Deals, Contacts, Tasks, Invoices)
     • Unified Identity & Sessions (Passkeys / WebAuthn, OAuth 2.0, SAML)
     • MCP Server & Gateway (Tool Discovery, Consent, Policy Enforcement)
     • Developer Platform (API Keys, Webhook Subscriptions & Deliveries)
     • Action Approval Center (Human-in-the-loop Shadow Mode)
     • Central Event Publisher (WebSocket STOMP + Kafka Event Bus)
    ═════════════════════════════════════════════════════════════════════════
             │                        │                        │
      JPA / Flyway             Redis Protocol             CloudEvents
             │                        │                        │
             ▼                        ▼                        ▼
    ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
    │  Relational DB   │     │  Redis 7 Cluster │     │   Apache Kafka   │
    │ PostgreSQL 16 /  │     │ Caching • Locks  │     │ Async Event Bus  │
    │     MySQL 8      │     │ Revocation Black │     │ Event Streaming  │
    └──────────────────┘     └──────────────────┘     └────────┬─────────┘
                                                               │
                                         ┌─────────────────────┴──────────┐
                                         ▼                                ▼
                              ┌────────────────────┐           ┌────────────────────┐
                              │ PYTHON AI PLATFORM │           │ PERFORMANCE ENGINE │
                              │ FastAPI / PyTorch  │           │ Rust SIMD Dedupe   │
                              │ 5 Domain Agents    │           │ Monte Carlo Math   │
                              │ "Ask My CRM" SQL   │           │ Low-Latency Worker │
                              └─────────┬──────────┘           └────────────────────┘
                                        │ Tool Invocations
                                        ▼
                              ┌────────────────────┐
                              │ MCP CONNECTED APPS │
                              │ Gmail • Calendar   │
                              │ Slack • GitHub     │
                              └────────────────────┘
```

---

## 4. Workload Separation & Multi-Language Boundaries

Languages are utilized strictly where their execution characteristics offer quantifiable performance advantages:

| Technology | Role & Ownership | Workload Boundaries |
| :--- | :--- | :--- |
| **Java (Spring Boot 3.2)** | **Primary Backend Core** | Transactional CRUD, business workflows, authentication, authorization, database persistence, REST/WebSocket APIs, tenant isolation, and audit logging. |
| **Python (FastAPI)** | **AI / ML & Agents** | Multi-agent orchestration, LLM provider routing, embedding generation, vector search, predictive scoring, and natural language analytics synthesis. |
| **Rust** | **High-Performance Native Engine** | SIMD-accelerated string distance (Jaro-Winkler) for massive deduplication, and high-iteration Monte Carlo revenue simulations. |
| **Go** | **High-Throughput Streaming (Optional)** | Webhook ingestion and high-concurrency log streaming workers where stateless ultra-high concurrency is required. |
| **C++ / C** | **Low-Level Native Boundary** | Reserved strictly for OS-level hooks, hardware biometric drivers, or media transcoding when validated by profiling benchmarks. |

---

## 5. Client Architecture

### 5.1 Web Application (`apps/web`)
- **Technology**: React 18, Vite 5, Tailwind CSS, Lucide icons.
- **Key Modules**: CRM OS Dashboard, Customer 360, Sales Kanban, Multi-Agent AI Hub, MCP Control Center, Developer Settings.
- **Performance Optimizations**: Route-level code splitting (`React.lazy`), optimistic UI mutations, API response caching, and request deduplication.

### 5.2 Desktop Application (`apps/desktop`)
- **Technology**: Tauri 2 with native OS shell.
- **Capabilities**: Local encrypted offline storage, background synchronization queue, native desktop notifications, system tray presence, and global keyboard shortcuts.

### 5.3 Mobile Applications (`apps/mobile`)
- **Architecture**: Kotlin for Android and Swift for iOS (with React Native/Expo SDK 51 shared interface).
- **Capabilities**: Hardware biometric authentication (FaceID, Fingerprint), push notifications, offline mutation sync queue with conflict detection, and mobile AI voice assistant.

---

## 6. Resilience & Circuit Breaker Architecture

The system enforces strict bulkhead isolation:
1. **Satellite Isolation**: If the Python AI service or Rust performance engine becomes unavailable, the Spring Boot core seamlessly activates in-JVM heuristic fallbacks. Core CRM business operations never fail or block.
2. **Integration Graceful Degradation**: External failures in third-party services (Gmail, Slack, GitHub) are isolated via 3-second timeouts and Resilience4j circuit breakers, returning partial UI indicators rather than throwing 500 errors.
3. **Database Portability**: Schema migrations are written in portable ANSI SQL to enable seamless execution across PostgreSQL 16, MySQL 8, and in-memory H2.
