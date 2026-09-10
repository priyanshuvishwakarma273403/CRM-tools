# CRM OS — AI Platform & Multi-Agent Mesh Specification

## 1. Overview & Vision

The **CRM OS AI Platform** transforms the CRM from a passive system of record into an active, autonomous **system of intelligence**.
The platform is hosted as an isolated satellite service (`services/ai-service`) in Python (FastAPI, PyTorch, LangChain, Hugging Face) and interfaces with the Java Spring Boot core via secure REST/Kafka communication.

```
                              USER / CLIENT REQUEST
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │  Spring Boot AI Service Gateway│
                       │ (Circuit Breaker & Fallbacks) │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │      AI Context Firewall      │
                       │  PII Redaction • Minimization │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │       AI Model Router         │
                       │ Provider Select • Cost Tracker│
                       └───────────────┬───────────────┘
                                       │
             ┌─────────────────────────┼─────────────────────────┐
             ▼                         ▼                         ▼
┌─────────────────────────┐ ┌─────────────────────┐ ┌─────────────────────────┐
│   Multi-Agent Mesh      │ │     Ask My CRM      │ │   RAG Knowledge Base    │
│ • Sales Strategist      │ │ (Safe Read-Only SQL)│ │ • Vector Embeddings     │
│ • Support Concierge     │ │ • Tenant Injection  │ │ • Tenant Document Chunks│
│ • Campaign Architect    │ │ • Chart Generator   │ │ • Role-Aware Retrieval  │
│ • Revenue Analyst       │ └─────────────────────┘ └─────────────────────────┘
│ • Market Intel          │
└────────────┬────────────┘
             │ High-Impact Actions
             ▼
┌─────────────────────────┐
│ Action Approval Center  │
│ (Shadow Mode Guard)     │
└─────────────────────────┘
```

---

## 2. Multi-Provider AI Model Router

The system is never locked to a single model vendor. The **Model Router** dynamically selects the optimal model based on task complexity, cost budget, latency requirements, and tenant privacy settings:

| Model Tier | Providers Supported | Best Suited Tasks | Fallback Target |
| :--- | :--- | :--- | :--- |
| **Reasoning Tier** | OpenAI `o1`/`gpt-4o`, Anthropic `claude-3-5-sonnet`, Gemini `1.5-pro` | Complex multi-step deal strategy, contract risk analysis, agent planning. | Next best cloud provider |
| **Speed / Utility Tier** | Gemini `1.5-flash`, OpenAI `gpt-4o-mini`, Claude `3-5-haiku` | Email drafts, copilot query shortcuts, sentiment analysis, task extraction. | Local Ollama / In-JVM rule |
| **Private / On-Prem Tier**| Local Ollama, vLLM, DeepSeek-R1 / Llama 3 | Strict healthcare/banking enterprise tenants prohibiting public cloud LLMs. | In-VPC private endpoint |

### 2.1 Governance & Telemetry
- **Token & Cost Tracking**: Accurately logs prompt tokens, completion tokens, and calculated dollar expenditure per tenant.
- **Latency & Timeout Protection**: 3.5s timeout per request with automatic failover to the designated fallback provider.
- **Tenant Policy Enforcer**: Enforces maximum monthly token budgets and restricts allowed model tiers per organization.

---

## 3. Specialized Multi-Agent AI Mesh

Each domain in the business OS is assigned an autonomous, specialized agent with explicit responsibilities and boundaries:

### 3.1 Domain Agent Roster
1. **Sales Strategist (`SalesAgent`)**:
   - Analyzes opportunity velocity, identifies missing decision-makers using MEDDIC criteria, generates objection-handling talk tracks, and recommends optimal follow-up intervals.
2. **Support Concierge (`SupportAgent`)**:
   - Triages incoming customer tickets, evaluates sentiment and SLA breach risk, drafts empathetic resolution responses, and recommends root-cause fixes.
3. **Campaign Architect (`MarketingAgent`)**:
   - Constructs segmented outbound campaigns, drafts personalized A/B email variants, generates LinkedIn message sequences, and identifies high-intent accounts.
4. **Revenue Analyst (`FinanceAgent`)**:
   - Analyzes recurring revenue (ARR/MRR), evaluates aged accounts receivable, flags renewal churn risks, and recommends payment collection workflows.
5. **Market Intelligence (`ResearchAgent`)**:
   - Extracts company technographic profiles, maps competitive threats, synthesizes public executive disclosures, and alerts sales reps to corporate buying signals.

### 3.2 Autonomous Agent Router (`AgentRouter`)
Users can submit unstructured natural language prompts without selecting a specific agent. The **Agent Router** classifies semantic intent vectors and delegates the request to the best-suited agent with zero context switching.

---

## 4. Agent Sandbox & Shadow Mode

Autonomous agents operate under strict containment:
* **Tool Allowlist**: Agents can only invoke tools explicitly granted to their role.
* **Token Budget & Time Limits**: Maximum 4,000 tokens and 10 seconds execution ceiling per invocation.
* **Action Limits**: Maximum 5 sequential tool invocations before requiring human intervention.
* **Shadow Mode**:
  1. *Stage 1 (Observation & Recommendation)*: Agent analyzes CRM data and recommends an action (e.g. "Send follow-up email to customer X").
  2. *Stage 2 (Assisted Execution)*: The action is placed in the **Action Approval Center**; executing requires explicit human approval.
  3. *Stage 3 (Autonomous Execution)*: Once confidence benchmarks (>95%) and tenant admin policies are established, repetitive low-risk actions execute autonomously.

---

## 5. Ask My CRM (Safe NL-to-SQL Analytics)

"Ask My CRM" allows business leaders to query their CRM database in natural language (e.g. *"Show revenue by deal stage for this quarter"* or *"Count leads by status"*).

### 5.1 Strict Safety Guardrails
To prevent data leaks, SQL injections, or unintended data corruption:
1. **Strict SQL Whitelist**: Only read-only `SELECT` statements are permitted.
2. **Forbidden Keyword Blacklist**: Any query containing `DROP`, `DELETE`, `UPDATE`, `INSERT`, `ALTER`, `TRUNCATE`, `EXEC`, `CREATE`, `REPLACE`, `GRANT`, `REVOKE`, `--`, `/*`, or `;` is immediately rejected.
3. **Mandatory Tenant Injection**: The engine automatically binds the caller's tenant filter (`WHERE organization_id = :org_id`).
4. **Structured Presentation**: Generates human-friendly narrative summaries alongside structured table data and recommended visualization types (`BAR`, `PIE`, `METRIC`, `TABLE`).

---

## 6. AI Memory & RAG Knowledge Base

### 6.1 Tenant-Isolated AI Memory (`ai_memories`)
- Stores learned organizational context, tone preferences, custom terminology, and user conversation context.
- Fully isolated by `organization_id` with time-to-live (TTL) and user deletion controls.

### 6.2 RAG Knowledge Base (`knowledge_documents`)
- Ingests enterprise documents: PDF, DOCX, PPTX, TXT, CSV, and internal knowledge base articles.
- Ingestion Pipeline:
  ```
  [Document Upload] ──► [Malware Scan] ──► [Text Extraction] ──► [Chunking (500 tokens)]
                                                                           │
                                                                           ▼
  [LLM Synthesis] ◄── [Role Filter] ◄── [Vector Retrieval] ◄── [Dense Embeddings]
  ```
- **Permission-Aware Retrieval**: Vector search queries filter results against the user's role access list (`access_roles`) before passing retrieved context to the LLM.
