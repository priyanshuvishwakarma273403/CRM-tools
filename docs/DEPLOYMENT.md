# CRM OS — Deployment & Infrastructure Specification

## 1. Local & Development Deployment (Docker Compose)

CRM OS provides a self-contained local deployment stack via `docker-compose.yml`:

```bash
# Start complete CRM OS stack
docker compose up -d

# Verify service health
docker compose ps
```

### 1.1 Service Topology & Port Allocation
| Service | Image / Build | Port | Internal DNS | Health Check |
| :--- | :--- | :--- | :--- | :--- |
| **Relational DB** | `postgres:16-alpine` | `5432` | `postgres` | `pg_isready -U crm_user` |
| **Cache & Locks** | `redis:7-alpine` | `6379` | `redis` | `redis-cli ping` |
| **Message Broker**| `confluentinc/cp-kafka:7.5.0`| `9092` | `kafka` | Built-in |
| **Zookeeper** | `confluentinc/cp-zookeeper:7.5.0`| `2181` | `zookeeper` | Built-in |
| **AI Satellite** | Dockerfile (`services/ai-service`)| `8000` | `ai-service` | `GET /health` |
| **Native Engine** | Dockerfile (`services/performance-engine`)| `50051`| `performance-engine`| Built-in |
| **Core Backend** | Dockerfile (`backend`)| `8080` | `backend` | `GET /actuator/health` |

---

## 2. Production Kubernetes (K8s) Architecture

For high-availability enterprise environments, the platform deploys to Kubernetes:

```
                          INGRESS CONTROLLER (NGINX / TRAEFIK)
                          • TLS 1.3 Termination (Let's Encrypt)
                          • Rate Limiting & DDOS Protection
                                        │
                                        ▼
    ┌───────────────────────────────────┴───────────────────────────────────┐
    │                                                                       │
    ▼                                                                       ▼
[Web & Desktop Static Assets]                                   [Spring Boot Backend Deployments]
(CDN / Cloudflare / S3)                                         (Replicas: 3+, Autoscaled via HPA)
                                                                            │
                                        ┌───────────────────────────────────┼───────────────────────────────────┐
                                        ▼                                   ▼                                   ▼
                            [StatefulSet: Postgres / MySQL]        [StatefulSet: Redis]              [Kafka Cluster (Strimzi)]
                            (Read Replica + Primary)               (Sentinel / Cluster Mode)         (3-Broker Replication)
                                                                            │
                                                                            ▼
                                                                [Python AI Service Pods]
                                                                (Auto-scaled on GPU/CPU)
```

### 2.1 Horizontal Pod Autoscaling (HPA)
* **Backend Pods**: Scale when average CPU utilization exceeds 70% or average HTTP request latency exceeds 250ms.
* **AI Service Pods**: Scale when queue depth exceeds 50 tasks or GPU compute exceeds 80%.

---

## 3. Environment Variables & Secret Management

Secrets must NEVER be committed to version control. Production utilizes secret managers (HashiCorp Vault, AWS Secrets Manager, or Kubernetes Secrets):

```bash
# Database Configuration
DATABASE_URL=jdbc:postgresql://postgres-primary:5432/crm_production
DATABASE_USERNAME=crm_master
DATABASE_PASSWORD=vault:secret/data/crm/db#password
DATABASE_DRIVER=org.postgresql.Driver
HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect

# Redis Configuration
REDIS_HOST=redis-sentinel
REDIS_PORT=6379

# Kafka Event Streaming
KAFKA_BOOTSTRAP_SERVERS=kafka-bootstrap:9092

# JWT Security
JWT_SECRET=vault:secret/data/crm/jwt#secret_key
JWT_ACCESS_EXPIRATION_MS=3600000

# Satellite Endpoints
CRM_AI_SERVICE_URL=http://ai-service.internal:8000
CRM_PERFORMANCE_SERVICE_URL=http://performance-engine.internal:50051
```

---

## 4. Disaster Recovery & Backup Strategy

1. **Automated Database Backups**:
   - Continuous write-ahead logging (WAL) shipping with Point-In-Time Recovery (PITR) up to 35 days.
   - Nightly full snapshots encrypted and replicated to secondary cloud regions.
2. **Recovery Time Objective (RTO)**: $< 15\text{ minutes}$ for service restoration.
3. **Recovery Point Objective (RPO)**: $< 1\text{ minute}$ of transactional data loss.
4. **Disaster Drills**: Automated monthly restoration tests into an isolated staging environment to verify snapshot integrity.
