# 🤝 CRM OS — Engineering Contribution & Architectural Guidelines

Thank you for contributing to **CRM OS**! As an enterprise-grade, mission-critical Business Operating System, we enforce rigorous architectural standards, automated testing thresholds, and security controls across all contributions.

This document outlines our engineering standards, branching strategy, commit conventions, and pull request workflow.

---

## 📋 Table of Contents
1. [Core Architectural Invariants](#1-core-architectural-invariants)
2. [Git Workflow & Branching Strategy](#2-git-workflow--branching-strategy)
3. [Conventional Commits Standard](#3-conventional-commits-standard)
4. [Language-Specific Engineering Standards](#4-language-specific-engineering-standards)
   - [4.1 Java (Spring Boot Core)](#41-java-spring-boot-core)
   - [4.2 TypeScript & React (Web & Desktop)](#42-typescript--react-web--desktop)
   - [4.3 React Native (Mobile Client)](#43-react-native-mobile-client)
   - [4.4 Python (AI Satellite Service)](#44-python-ai-satellite-service)
   - [4.5 Rust (Native Engine & Tauri Shell)](#45-rust-native-engine--tauri-shell)
   - [4.6 SQL Migrations (Flyway)](#46-sql-migrations-flyway)
5. [Testing & Quality Verification](#5-testing--quality-verification)
6. [Pull Request (PR) Submission Checklist](#6-pull-request-pr-submission-checklist)
7. [Licensing & Copyright Attribution](#7-licensing--copyright-attribution)

---

## 1. Core Architectural Invariants

Every pull request is reviewed against our **Seven Non-Negotiable System Invariants**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SEVEN SYSTEM INVARIANTS                         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. ONE CENTRALIZED BACKEND   : Spring Boot 3.2 on /api/v1               │
│ 2. ONE SOURCE OF TRUTH       : Central Relational DB (PostgreSQL)      │
│ 3. ONE IDENTITY SYSTEM       : Central IAM (Passkeys, OAuth2, SSO)     │
│ 4. ONE AUTHORIZATION MODEL   : Unified RBAC + ABAC + Tenant Isolation   │
│ 5. ONE AUDIT PLATFORM        : Immutable audit log across AI, MCP, DB  │
│ 6. ONE DATA PLATFORM         : Synchronized transactional & cache state│
│ 7. ONE EVENT ARCHITECTURE    : Kafka / CloudEvents asynchronous bus    │
└────────────────────────────────────────────────────────────────────────┘
```

> [!CAUTION]
> **Zero Client Duplication Rule**: Never add database tables, offline revenue calculations, or core business rules to Web, Desktop, or Mobile clients. Clients are strictly presentation layers.

---

## 2. Git Workflow & Branching Strategy

We follow a structured Git feature-branch workflow:

* `main` — Production branch. Protected. Only merges from release PRs with all checks passing.
* `develop` — Integration branch. Default branch for day-to-day active development.
* `feat/<issue-id>-<short-description>` — New features (e.g. `feat/crm-104-mcp-slack-connector`).
* `fix/<issue-id>-<short-description>` — Bug fixes (e.g. `fix/crm-212-tenant-cache-invalidation`).
* `docs/<short-description>` — Documentation updates (e.g. `docs/getting-started-update`).
* `perf/<short-description>` — Performance optimizations (e.g. `perf/rust-simd-benchmarks`).

### Creating a Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feat/crm-305-kanban-drag-and-drop
```

---

## 3. Conventional Commits Standard

Commit messages must adhere strictly to the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/) specification:

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Supported Types
- `feat`: A new user-facing or API feature
- `fix`: A bug fix
- `refactor`: Code refactoring without behavioral alterations
- `perf`: Code changes that improve performance
- `docs`: Documentation modifications or additions
- `test`: Adding or correcting automated tests
- `chore`: Build scripts, dependencies, or tool configurations

### Examples
```text
feat(deals): add probability adjustment algorithm in deal stage change
fix(auth): clear redis token revocation entry on account deletion
docs(architecture): update mcp client security diagrams
test(lead): add unit tests for lead conversion to contact and deal
```

---

## 4. Language-Specific Engineering Standards

### 4.1 Java (Spring Boot Core)
* **JDK Version**: Java 17 or 21 LTS.
* **Code Formatting**: Follow standard Google Java Style. Indentation is 4 spaces.
* **Transactions**: Mark all read-only repository calls with `@Transactional(readOnly = true)` to avoid unnecessary Hibernate dirty checking.
* **Tenant Scoping**: All service layer operations must assert `TenantContext.getTenantId()` and verify tenant boundaries before executing mutations.
* **Error Handling**: Use semantic domain exceptions caught by `GlobalExceptionHandler`. Always return responses inside `ApiResponse<T>`.

### 4.2 TypeScript & React (Web & Desktop)
* **Type Safety**: Strictly typed TypeScript with zero `any` types allowed.
* **State Management**: Use Zustand for client state and TanStack Query (`@tanstack/react-query`) for server state. Never duplicate server state in local state.
* **Component Design**: Modular atomic components with clear prop interfaces. Use Tailwind CSS utilities and design tokens defined in [docs/DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
* **Animations**: Fluid micro-interactions via Framer Motion complying with [docs/MOTION_GUIDELINES.md](MOTION_GUIDELINES.md).

### 4.3 React Native (Mobile Client)
* **Navigation**: File-based routing using Expo Router 3+.
* **Offline Mutations**: Offline mutations must be queued in local SQLite storage and batched to `POST /api/v1/sync/batch` upon network restoration.
* **Secure Storage**: Authentication tokens must be saved strictly in `expo-secure-store`, never in unencrypted `AsyncStorage`.

### 4.4 Python (AI Satellite Service)
* **Code Style**: Black formatter (line length 100), Flake8 linter, and isort for imports.
* **Typing**: All FastAPI request and response payloads must use Pydantic v2 schemas (`BaseModel`) with comprehensive field validation.
* **PII Redaction**: All text passed to external LLM providers must pass through the `AIContextFirewall` for redaction.

### 4.5 Rust (Native Engine & Tauri Shell)
* **Formatting**: Format code using `cargo fmt` before committing.
* **Linter**: Ensure zero warnings from `cargo clippy --all-targets --all-features`.
* **Error Handling**: Never use `.unwrap()` or `.expect()` in production code paths. Use `Result<T, EngineError>` with proper pattern matching.

### 4.6 SQL Migrations (Flyway)
* All schema changes must be added as new versioned migration files in `database/migrations/`.
* **Naming**: `V<Version>__<Brief_Description>.sql` (e.g. `V5__custom_dashboard_widgets.sql`).
* **Portability**: Write ANSI-compliant SQL compatible with both PostgreSQL 16 and MySQL 8. Always include compound tenant indexes (`organization_id, created_at DESC`).

---

## 5. Testing & Quality Verification

Before opening a pull request, run all automated test suites locally:

```powershell
# On Windows:
powershell -ExecutionPolicy Bypass -File .\scripts\test-all.ps1

# On Linux / macOS:
./scripts/test-all.sh
```

### Coverage Requirements
- **Backend Service Layer**: Minimum 85% branch coverage.
- **Security & Multi-Tenant Modules**: 100% test coverage mandatory.
- **Frontend Components**: Unit test critical UI state transitions with React Testing Library / Vitest.

---

## 6. Pull Request (PR) Submission Checklist

Before requesting a review, verify that your PR meets all criteria:

- [ ] Branch is rebased onto latest `origin/develop`.
- [ ] Code passes all linting (`cargo clippy`, `eslint`, `flake8`, `mvn test`).
- [ ] No database credentials, API keys, or JWT secrets committed (`.gitignore` respected).
- [ ] Migration scripts follow Flyway conventions and ANSI SQL portability.
- [ ] Corresponding unit and integration tests are added or updated.
- [ ] Relevant documentation in `docs/` is updated.
- [ ] PR description clearly states the problem solved, architectural approach, and testing evidence.

---

## 7. Licensing & Copyright Attribution

By contributing to **CRM OS**, you agree that your contributions will be licensed under the **Apache License, Version 2.0**.

All source files must contain the standard Apache 2.0 header notice:

```text
Copyright 2026 CRM OS Platform Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
```

For complete licensing terms, refer to the project [LICENSE](../LICENSE).
