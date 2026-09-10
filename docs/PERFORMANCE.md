# CRM OS — Performance Engineering & Native Workload Specification

## 1. Performance Engineering Philosophy

In CRM OS, performance is a non-negotiable architectural invariant:
* **Measure First**: No native language (Rust, Go, C++, C) is ever introduced based on speculation. A measurable CPU or memory bottleneck must be proven by profiling benchmarks.
* **Efficient Core**: The Java/Spring Boot backend is tuned for high concurrency, zero unnecessary object allocation, and sub-100ms transactional responses.
* **Graceful Degradation**: Intensive calculations (deduplication, forecasting, AI analysis) execute asynchronously or via isolated satellite services, guaranteeing that core transactional CRUD is never blocked.

---

## 2. SLA & Performance Targets

| Metric | Target (p95) | Target (p99) | Benchmark Scenario |
| :--- | :--- | :--- | :--- |
| **Core CRUD API Latency** | $< 45\text{ ms}$ | $< 95\text{ ms}$ | Standard customer, lead, deal operations |
| **Customer 360 Aggregation** | $< 75\text{ ms}$ | $< 150\text{ ms}$| Profile + deals + timeline + health score |
| **MCP Tool Invocation** | $< 80\text{ ms}$ | $< 180\text{ ms}$| Policy verification + internal CRM tool |
| **Ask My CRM NL-to-SQL** | $< 400\text{ ms}$ | $< 800\text{ ms}$| SQL generation + execution + explanation |
| **Deduplication Scan (100k records)**| $< 1.2\text{ s}$| $< 2.5\text{ s}$| Rust SIMD Jaro-Winkler scan |
| **Web Frontend FCP** | $< 0.8\text{ s}$ | $< 1.4\text{ s}$| First Contentful Paint on mobile & web |

---

## 3. Database & Persistence Layer Optimization

1. **Connection Pooling (HikariCP)**:
   - Optimized pool size calculated via: $\text{Pool Size} = (2 \times \text{Core Count}) + \text{Disk Spindle Count}$.
   - Minimum idle connections: 10, Maximum pool size: 50.
   - Connection timeout: 3,000ms.
2. **Indexing & Query Planning**:
   - Every tenant query is backed by compound indexes (`organization_id, created_at DESC`).
   - Deep pagination uses keyset pagination (cursor-based) for tables exceeding 100,000 records.
3. **Batch Operations**:
   - JPA batching enabled (`hibernate.jdbc.batch_size: 50`, `hibernate.order_inserts: true`, `hibernate.order_updates: true`).

---

## 4. Native Language Boundaries & Workload Justification

```
                      WORKLOAD CLASSIFICATION DECISION TREE
                                        │
                                        ▼
                           Is it core business logic,
                           auth, or standard CRUD?
                                  /            \
                             YES /              \ NO
                                ▼                ▼
                        [Java / Spring Boot]   Does it require heavy CPU math
                                               or SIMD string comparisons?
                                                    /            \
                                               YES /              \ NO
                                                  ▼                ▼
                                            [Rust Engine]      Is it AI, ML, NLP,
                                                               or RAG embeddings?
                                                                    /            \
                                                               YES /              \ NO
                                                                  ▼                ▼
                                                          [Python AI Platform]  [Go / Java]
```

### 4.1 Rust Workload (`services/performance-engine`)
- **Justification**: Comparing 100,000 customer names against incoming leads requires $100,000 \times 10,000 = 10^9$ string distance calculations. Standard JVM implementations produce GC pressure and exceed 15 seconds. Rust with AVX2 SIMD instructions completes this in $< 1.2\text{ seconds}$.
- **Fallback Guarantee**: In case the Rust binary is not compiled on Windows dev machines, Spring Boot's `PerformanceServiceClient` includes an in-JVM Java fallback so development is never blocked.

---

## 5. Web & Mobile Frontend Optimization

1. **Bundle Splitting & Lazy Loading**:
   - All feature pages (Deals, Leads, Settings, AI Hub) use `React.lazy()` dynamic imports.
   - Initial JavaScript bundle size $< 280\text{ KB}$ gzipped.
2. **Optimistic UI Updates**:
   - Kanban board stage moves and task completions update the UI immediately with rollback upon API failure.
3. **Virtualized Rendering**:
   - Large tables and contact lists use virtualized windowing (`react-window`), maintaining $< 60\text{ FPS}$ scrolling regardless of dataset size.
