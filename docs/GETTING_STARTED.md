# 🚀 CRM OS — Developer Onboarding & Getting Started Guide

Welcome to **CRM OS**, the enterprise AI-native Business Operating System. This guide provides step-by-step instructions for setting up, compiling, running, and debugging the entire platform locally.

---

## 📋 Table of Contents
1. [Prerequisites & System Requirements](#1-prerequisites--system-requirements)
2. [Quickstart via Docker Compose (Recommended)](#2-quickstart-via-docker-compose-recommended)
3. [Manual Local Development Setup](#3-manual-local-development-setup)
   - [3.1 Relational Database & Redis](#31-relational-database--redis)
   - [3.2 Central Spring Boot Core Backend](#32-central-spring-boot-core-backend)
   - [3.3 Web Application (React 18 / Vite)](#33-web-application-react-18--vite)
   - [3.4 Desktop Client (Tauri 2 / Rust)](#34-desktop-client-tauri-2--rust)
   - [3.5 Mobile Application (React Native / Expo)](#35-mobile-application-react-native--expo)
   - [3.6 Python AI Satellite Service](#36-python-ai-satellite-service)
   - [3.7 Rust Native Performance Engine](#37-rust-native-performance-engine)
4. [Default Seed Data & Demo Accounts](#4-default-seed-data--demo-accounts)
5. [Health Checks & Verification](#5-health-checks--verification)
6. [Developer Automation Scripts](#6-developer-automation-scripts)
7. [Common Troubleshooting & FAQ](#7-common-troubleshooting--faq)
8. [Next Steps & Deep Dive Documentation](#8-next-steps--deep-dive-documentation)

---

## 1. Prerequisites & System Requirements

Before running the platform, ensure your local development workstation meets the following minimum technical specifications:

| Toolchain / Runtime | Required Version | Purpose | Verification Command |
| :--- | :--- | :--- | :--- |
| **Java Development Kit (JDK)** | **17** or **21** (LTS) | Core backend compilation & runtime | `java -version` |
| **Node.js** | **v18.0.0** or higher (v20 LTS recommended) | Web, Desktop, Mobile package manager | `node -v` |
| **npm / pnpm / yarn** | npm 9+ | JavaScript dependency management | `npm -v` |
| **Docker & Docker Compose** | Docker Engine 24+ / Compose v2 | Local container orchestration | `docker compose version` |
| **Python** | **3.10** or **3.11** | AI Satellite Service & Multi-Agent Mesh | `python --version` |
| **Rust & Cargo** | **1.75** or higher | Desktop client (Tauri) & Native engine | `cargo --version` |
| **Git** | 2.30+ | Source control | `git --version` |

> [!TIP]
> **Windows Users**: Ensure PowerShell 5.1+ or PowerShell 7 (Core) is installed. Enable execution policy if running scripts: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`.

---

## 2. Quickstart via Docker Compose (Recommended)

The fastest way to launch the full platform ecosystem (PostgreSQL, Redis, Kafka, Zookeeper, AI Service, Performance Engine, and Spring Boot Backend) is with Docker Compose.

```bash
# 1. Clone repository and navigate to root directory
cd crm-platform

# 2. Start all platform infrastructure and services in detached mode
docker compose up -d

# 3. Verify that all 7 containers are healthy and running
docker compose ps
```

### Allocated Ports Summary
- **Backend REST API & WebSockets**: `http://localhost:8080/api/v1`
- **Swagger / OpenAPI Interactive Docs**: `http://localhost:8080/swagger-ui.html`
- **Python AI Satellite Service**: `http://localhost:8000`
- **Rust Native Performance Engine**: `http://localhost:50051`
- **PostgreSQL 16 Database**: `localhost:5432` (User: `crm_user`, Pass: `crm_password`, DB: `crm_db`)
- **Redis 7 In-Memory Cache**: `localhost:6379`
- **Apache Kafka Broker**: `localhost:9092`

---

## 3. Manual Local Development Setup

If you are developing features in a specific component, run dependencies in Docker and start target services on your host machine for hot reload.

### 3.1 Relational Database & Redis
Start only PostgreSQL and Redis using Docker:
```bash
docker compose up -d postgres redis
```

---

### 3.2 Central Spring Boot Core Backend
The backend is the single authoritative source of truth for all business logic, multi-tenancy, authentication, and data validation.

```bash
# Navigate to backend directory
cd backend

# On macOS / Linux:
./mvnw spring-boot:run

# On Windows (PowerShell / Command Prompt):
.\mvnw.cmd spring-boot:run
```

* **API Base URL**: `http://localhost:8080/api/v1`
* **Swagger UI Documentation**: `http://localhost:8080/swagger-ui/index.html`
* **Health Check**: `http://localhost:8080/actuator/health`

---

### 3.3 Web Application (React 18 / Vite)
The web client is a high-performance single page application built with React 18, Vite, Tailwind CSS, TanStack Query, and Framer Motion.

```bash
cd apps/web

# Install client dependencies
npm install

# Start Vite hot-reloading development server
npm run dev
```

* **Web UI URL**: `http://localhost:5173`

---

### 3.4 Desktop Client (Tauri 2 / Rust)
The desktop client wraps the React frontend inside a secure, lightweight Tauri 2.0 native shell with an offline-capable SQLite database.

```bash
cd apps/desktop

# Install JavaScript and Rust dependencies
npm install

# Launch Tauri development desktop application
npm run tauri dev
```

> [!NOTE]
> On Windows, ensure you have the **C++ Build Tools for Visual Studio** installed (available via Visual Studio Installer). On Linux, install `libwebkit2gtk-4.1-dev`, `build-essential`, and `libssl-dev`.

---

### 3.5 Mobile Application (React Native / Expo)
The mobile client provides a native iOS and Android experience built on Expo SDK 51 and Expo Router, featuring offline mutation queuing.

```bash
cd apps/mobile

# Install mobile dependencies
npm install

# Start Expo development server
npx expo start
```

* Press `a` in the terminal to open the **Android Emulator**.
* Press `i` to open the **iOS Simulator** (macOS only).
* Scan the QR code using the **Expo Go** app on your physical device.

---

### 3.6 Python AI Satellite Service
The AI Service hosts the multi-agent mesh, LangChain integrations, Model Context Protocol (MCP) tool execution, and the "Ask My CRM" natural language to SQL engine.

```bash
cd services/ai-service

# Create and activate a Python virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS / Linux:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start FastAPI server with live reload
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

* **AI Service URL**: `http://localhost:8000`
* **Interactive API Docs (FastAPI)**: `http://localhost:8000/docs`

---

### 3.7 Rust Native Performance Engine
The performance engine executes intensive computing tasks including SIMD vector deduplication, Monte Carlo deal simulations, and high-frequency bulk lead ingestion.

```bash
cd services/performance-engine

# Run Axum HTTP microservice
cargo run
```

* **Engine Listening on**: `http://localhost:50051`

---

## 4. Default Seed Data & Demo Accounts

When the backend starts, Flyway automatically runs database migrations (`database/migrations/V1__canonical_schema.sql` through `V4__crm_os_foundation.sql`) and inserts seed data (`database/seed/V2__seed_data.sql`).

Use any of these pre-configured demo credentials to sign in:

| Email | Password | Role | Organization Tenant | Assigned Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| `admin@nexus.com` | `password123` | `ADMIN` | Acme Corp (`org-demo-1`) | Full platform governance, user management, audit trails |
| `manager@nexus.com` | `password123` | `MANAGER` | Acme Corp (`org-demo-1`) | Pipeline forecasting, team approvals, analytics |
| `agent@nexus.com` | `password123` | `SALES_AGENT` | Acme Corp (`org-demo-1`) | Leads, Deals, Contacts, Tasks, Communications |

---

## 5. Health Checks & Verification

Verify each platform service using these standard HTTP endpoints:

```bash
# Verify Spring Boot Core Backend
curl -s http://localhost:8080/actuator/health | jq .

# Verify Python AI Satellite
curl -s http://localhost:8000/health | jq .

# Verify PostgreSQL Connection
docker compose exec postgres pg_isready -U crm_user -d crm_db

# Verify Redis In-Memory Cache
docker compose exec redis redis-cli ping
```

---

## 6. Developer Automation Scripts

The repository includes pre-built automation scripts inside `scripts/` to streamline builds, testing, and environment setup across Windows and Unix:

| Script | Platform | Functionality | Command Example |
| :--- | :--- | :--- | :--- |
| `scripts/build-all.ps1` | Windows | Builds backend JAR, builds Web & Desktop assets | `powershell -File .\scripts\build-all.ps1` |
| `scripts/build-all.sh` | Unix / macOS | Compiles backend JAR and production builds | `./scripts/build-all.sh` |
| `scripts/test-all.ps1` | Windows | Runs Spring Boot test suite against in-memory H2 | `powershell -File .\scripts\test-all.ps1` |
| `scripts/test-all.sh` | Unix / macOS | Executes all automated unit and integration tests | `./scripts/test-all.sh` |
| `scripts/dev-all.ps1` | Windows | Interactive multi-process development launcher | `powershell -File .\scripts\dev-all.ps1` |
| `scripts/migrate-db.ps1`| Windows | Applies Flyway database migrations to PostgreSQL | `powershell -File .\scripts\migrate-db.ps1` |

---

## 7. Common Troubleshooting & FAQ

### Port 5432 or 8080 Already in Use
* **Issue**: Another local instance of PostgreSQL or Tomcat/Spring is occupying port 5432 or 8080.
* **Resolution**: Terminate the occupying process or customize the port via environment variables in `.env` (e.g. `PORT=8081` and `DATABASE_URL=jdbc:postgresql://localhost:5433/crm_db`).

### Flyway Migration Checksum Failure
* **Issue**: Modifying an already applied migration script causes Flyway validation errors.
* **Resolution**: In local dev, drop and recreate the test database:
  ```bash
  docker compose down -v
  docker compose up -d postgres
  ```

### Cross-Origin Request Blocked (CORS)
* **Issue**: Client fails to query `/api/v1` due to CORS errors.
* **Resolution**: Ensure `application.yml` or Spring Security CORS configuration allows `http://localhost:5173` (Vite Web) and `tauri://localhost` (Tauri Desktop).

---

## 8. Next Steps & Deep Dive Documentation

Now that your local instance is active, explore the comprehensive architectural specifications:

* 🏛️ **[Master System Architecture](ARCHITECTURE.md)** — Core invariants, multi-tenant isolation, and data flows.
* 📡 **[Master REST & WebSocket API](API.md)** — Complete endpoint catalog, request envelopes, and event contracts.
* 🤖 **[AI Multi-Agent Mesh Specification](AI_ARCHITECTURE.md)** — Autonomous agent mesh, AI Firewall, and RAG pipelines.
* 🔌 **[Model Context Protocol (MCP) Guide](MCP_ARCHITECTURE.md)** — MCP Server, MCP Gateway, and third-party AI integration.
* 🔒 **[Security & IAM Architecture](SECURITY.md)** — Passkeys, WebAuthn, JWT dual-token flow, and RBAC matrix.
* 💾 **[Database & Persistence Strategy](DATABASE.md)** — Entity schemas, indexing strategy, and Redis caching topologies.
* 🤝 **[Contributing Guidelines](CONTRIBUTING.md)** — Code conventions, branching models, and PR verification rules.
* 📄 **[Project License](../LICENSE)** — Apache License 2.0 terms and commercial usage guidelines.
