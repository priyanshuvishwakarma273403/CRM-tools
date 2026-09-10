# CRM OS — Testing & Verification Specification

## 1. Quality Philosophy & Testing Pyramid

In CRM OS, automated verification is mandatory before any release or migration:

```
                          ▲
                         / \
                        / E2E \       <-- Playwright / Cypress User Journeys
                       /-------\
                      /   API   \     <-- MockMvc Integration Tests (/api/v1/*)
                     /-----------\
                    / Integration \   <-- Flyway Migrations, JPA Repositories, Redis
                   /---------------\
                  /      Unit       \ <-- Java Business Logic, AI Engine, Rust SIMD
                 /-------------------\
```

---

## 2. Backend Automated Test Architecture

The Spring Boot test infrastructure runs with zero external runtime dependencies by employing an in-memory H2 database running in strict PostgreSQL mode (`MODE=PostgreSQL`).

### 2.1 Automated Test Suites
1. **`CrmApplicationTests`**:
   - Boots full Spring ApplicationContext.
   - Executes all Flyway database migrations (`V1` through `V4`).
   - Verifies Hibernate entities, constraints, and Spring Bean wiring.
2. **`McpControllerTest`**:
   - Tests tool discovery endpoint `GET /api/v1/mcp/tools`.
   - Validates JSON Schema definitions for built-in CRM tools.
   - Executes `crm.get_sales_report` and verifies successful status and calculated KPIs.
3. **`DeveloperPlatformTest`**:
   - Tests REST API Key lifecycle: generation, SHA-256 hashing, listing, and revocation.
   - Tests Webhook lifecycle: registration, event subscription, and test ping dispatch.

---

## 3. Executing Test Suites

### 3.1 One-Command Full Platform Verification
```powershell
# Run all backend unit and integration test suites
powershell -ExecutionPolicy Bypass -File scripts\test-all.ps1
```

### 3.2 Individual Test Execution
```powershell
# Run MCP Controller tests
.\mvnw.cmd test -Dtest=McpControllerTest

# Run Developer Platform tests
.\mvnw.cmd test -Dtest=DeveloperPlatformTest
```

---

## 4. Frontend & Build Verification

The Web and Desktop client applications are validated using Vite:
```powershell
# Verify Web application build
cd apps/web
npm run build

# Verify Desktop client application build
cd apps/desktop
npm run build
```

---

## 5. AI Evaluation & Safety Regression Testing

The AI Satellite service (`services/ai-service`) incorporates automated safety and accuracy assertions:
1. **SQL Safety Invariance**: Tests verify that queries containing `DROP`, `DELETE`, `UPDATE`, `INSERT`, `ALTER`, or `TRUNCATE` are blocked 100% of the time.
2. **Tenant Boundary Assertion**: Tests verify that all generated queries strictly contain `organization_id = :org_id`.
3. **Fallback Invariance**: Tests verify that if satellite network calls fail, the Spring Boot core returns deterministic heuristic responses within 200ms without throwing runtime exceptions.
