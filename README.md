# CRM Platform — Unified Commercial Architecture

A production-grade, multi-tenant CRM platform consolidating Web, Desktop, and Mobile clients around **ONE centralized Spring Boot backend API** powered by PostgreSQL and Redis.

---

## 🏛️ System Architecture

```text
                                   CRM PLATFORM
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           │                            │                            │
           ▼                            ▼                            ▼
      WEB CLIENT                  DESKTOP CLIENT               MOBILE CLIENT
   React 18 / Vite              Tauri 2 / React             React Native / Expo
   (apps/web)                   (apps/desktop)              (apps/mobile)
           │                            │                            │
           └────────────────────────────┼────────────────────────────┘
                                        │
                                HTTP / REST API (JWT)
                                        │
                                        ▼
                             ┌─────────────────────┐
                             │    SINGLE BACKEND   │
                             │  Spring Boot 3.2.3  │
                             │     Java 17/21      │
                             └──────────┬──────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
            PostgreSQL 16            Redis 7          Local Storage
            (Database)               (Cache)          (SQLite Offline)
```

---

## 📁 Repository Structure

| Directory | Purpose | Tech Stack |
| :--- | :--- | :--- |
| `apps/web` | Web CRM Application | React 18, Vite, Tailwind CSS |
| `apps/desktop` | Cross-Platform Desktop CRM | Tauri 2.0, Rust, React, SQLite |
| `apps/mobile` | Mobile CRM Application | React Native, Expo SDK 51, Expo Router |
| `backend` | **Single Centralized Backend** | Spring Boot 3.2.3, Java 17/21, Spring Security |
| `database` | Schema Migrations & Seeds | PostgreSQL 16 Flyway SQL Migrations |
| `infrastructure` | Production Deployment | Docker Compose, Redis, PostgreSQL |
| `docs` | Architecture Documentation | Markdown, Diagrams |

---

## ⚙️ Prerequisites

- **Java Development Kit (JDK)**: Java 17 or 21
- **Node.js**: v18.0.0 or higher
- **Docker Desktop**: For running PostgreSQL and Redis containers
- **Android Studio / Xcode**: (Optional) for mobile native simulation

---

## 🚀 Getting Started

### 1. Start Infrastructure (Database & Redis)

```bash
docker-compose up -d postgres redis
```

### 2. Start Centralized Backend

```bash
cd backend
./mvnw spring-boot:run
```

*On Windows:*
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
The API server will launch at: `http://localhost:8080/api/v1`
OpenAPI Documentation: `http://localhost:8080/swagger-ui/index.html`

---

### 3. Start Web Client

```bash
cd apps/web
npm install
npm run dev
```
Web app will be running at `http://localhost:5173`.

---

### 4. Start Desktop Client

```bash
cd apps/desktop
npm install
npm run tauri dev
```

---

### 5. Start Mobile Client

```bash
cd apps/mobile
npm install
npx expo start
```

---

## 🔑 Key Features & Security Architecture

- **Stateless JWT Security**: Dual-token architecture (Short-lived Access Tokens + 7-day Refresh Tokens).
- **Multi-Tenant Isolation**: Request-scoped `TenantContext` ThreadLocal guarantees 100% data separation per Organization.
- **RBAC Controls**: Standardized roles (`ADMIN`, `MANAGER`, `SALES_AGENT`, `SUPPORT_AGENT`) enforced at the backend service layer.
- **Offline-First Synchronization**: Mobile & Desktop queue mutations locally in SQLite when network is unreachable, automatically retrying batch upload on reconnection (`POST /api/v1/sync/batch`).
- **Unified Domain Engine**: Leads, Contacts, Companies, Deals (Kanban), Tasks, Products, Invoices, Workflows, Notifications, and Audit Logs managed by ONE authoritative database.

---

## 🛠️ Developer Automation Scripts

Pre-configured scripts are available in the `scripts/` directory for common workflows:

| Script | Platform | Description |
| :--- | :--- | :--- |
| `scripts/build-all.ps1` / `.sh` | Windows / Unix | Compiles backend JAR and runs production builds for Web & Desktop apps |
| `scripts/test-all.ps1` / `.sh` | Windows / Unix | Executes Spring Boot unit/integration test suite against in-memory H2 with Flyway |
| `scripts/dev-all.ps1` / `.sh` | Windows / Unix | Interactive launcher to start backend and client apps in dev mode |
| `scripts/migrate-db.ps1` / `.sh`| Windows / Unix | Executes Flyway schema and seed migrations against PostgreSQL |

**Quick Build Example:**
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build-all.ps1
```

**Quick Test Example:**
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test-all.ps1
```

---

## 🔐 Default Demo Credentials

Pre-seeded via Flyway `V2__seed_data.sql`:

| Email | Password | Role | Organization |
| :--- | :--- | :--- | :--- |
| `admin@nexus.com` | `password123` | `ADMIN` | Acme Corp (`org-demo-1`) |
| `manager@nexus.com` | `password123` | `MANAGER` | Acme Corp (`org-demo-1`) |
| `agent@nexus.com` | `password123` | `SALES_AGENT` | Acme Corp (`org-demo-1`) |

---

## 📡 Centralized API Endpoints (`/api/v1`)

All Web, Desktop, and Mobile clients communicate strictly with these endpoints:

| Module | Base Path | Methods & Capabilities |
| :--- | :--- | :--- |
| **Auth** | `/api/v1/auth` | `POST /login`, `POST /register`, `POST /refresh`, `POST /logout` |
| **Leads** | `/api/v1/leads` | Full CRUD, filtering, pagination, conversion to Deal/Contact |
| **Deals** | `/api/v1/deals` | Full CRUD, pipeline stages (`LEAD`, `PROPOSAL`, `WON`, etc.) |
| **Contacts** | `/api/v1/contacts` | Full CRUD, company link, address/phone management |
| **Companies**| `/api/v1/companies` | Full CRUD, domain tracking, address records |
| **Tasks** | `/api/v1/tasks` | Full CRUD, `PATCH /{id}/complete`, priority & due dates |
| **Activities**| `/api/v1/activities`| Audit trails, notes, calls, email records |
| **Calendar** | `/api/v1/calendar` | Event scheduling, start/end timestamps, attendee lists |
| **Files** | `/api/v1/files` | File upload/storage abstraction with disk persistence |
| **Reports** | `/api/v1/reports` | Aggregated dashboard KPI metrics, pipeline revenue |
| **Users** | `/api/v1/users` | Profile lookups, organization team member roster |
| **WebSocket**| `/api/v1/ws` | STOMP/SockJS broker broadcasting on `/topic/events` |

---

## 📊 Environment Variables

| Variable | Used By | Description |
| :--- | :--- | :--- |
| `SERVER_PORT` | Backend | Application port (Default: `8080`) |
| `DATABASE_URL` | Backend | PostgreSQL connection URL |
| `REDIS_URL` | Backend | Redis cache URL |
| `JWT_SECRET` | Backend | Secret key for signing JWT tokens |
| `VITE_API_URL` | Web & Desktop | Backend REST API endpoint URL (`http://localhost:8080/api/v1`) |
| `EXPO_PUBLIC_API_URL` | Mobile | Backend REST API endpoint URL (`http://localhost:8080/api/v1`) |

