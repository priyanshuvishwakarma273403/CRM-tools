# CRM OS — UI Architecture & Frontend Engineering Specification

## 1. Architectural Philosophy

CRM OS rejects traditional CRUD dashboard paradigms in favor of an **Intelligent Business Operating System**:
- **Single Authoritative Ingress**: The frontend never contains local business databases or divergent state machines. All state syncs through the authoritative `/api/v1` REST & STOMP WebSocket gateway.
- **Explainability as a Core Primitive**: Every metric, AI recommendation, and workflow proposal includes inline factor drivers and data transparency ("Why?").
- **Universal Multi-Platform Continuum**: The React web app, Tauri desktop wrapper, and Expo mobile client share identical design tokens, component contracts, and UX conventions.

---

## 2. Component Hierarchy & Layering

```
┌──────────────────────────────────────────────────────────┐
│                   Global Shell Layer                     │
│  CommandPalette (Ctrl+K) • AiCopilotDrawer • SyncBar     │
├──────────────────────────────────────────────────────────┤
│                   Layout & Navigation                    │
│  Sidebar • Topbar • Breadcrumbs • PageHeader             │
├──────────────────────────────────────────────────────────┤
│                 Specialized CRM OS Modules               │
│  Customer 360 • Pipeline Kanban • Visual Workflow Builder│
│  Relationship Graph • Central Timeline • Approval Center │
├──────────────────────────────────────────────────────────┤
│                 Design System Primitives                 │
│  Card • Button • Badge • Drawer • Dialog • ExplainBadge  │
├──────────────────────────────────────────────────────────┤
│                     Design Tokens                        │
│  Colors • Typography • Spacing • Radius • Shadows        │
└──────────────────────────────────────────────────────────┘
```

---

## 3. State Management Strategy

1. **Server Cache (`@tanstack/react-query`)**:
   - Manages asynchronous server state, optimistic mutations, request deduplication, and stale-while-revalidate caching.
2. **Session & Tenant Stores (`zustand`)**:
   - `useAuthStore`: JWT dual-token lifecycle, current user identity, and organization context.
   - `useTenantStore`: Dark mode toggle, sidebar collapsed state, active tenant configuration.
3. **Optimistic Mutation Pipeline**:
   - When a user updates deal stages or approves AI actions, the UI applies an immediate optimistic update. If the backend fails or rejects the mutation, the store rolls back and alerts the user.

---

## 4. Code Splitting & Performance Budget

- **Route-Level Splitting**: React lazy loading splits heavy visualization dependencies (Recharts, Canvas graph) to preserve a rapid First Contentful Paint (FCP &lt; 800ms).
- **Asset Optimization**: SVG icons are provided via tree-shaken `lucide-react` imports.
- **Offline Sync Queue**: Mutations triggered while disconnected are pushed to `localStorage` queue and flushed automatically upon reconnection.
