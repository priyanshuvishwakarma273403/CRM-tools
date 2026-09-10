# CRM OS — User Experience (UX) & Product Interaction Guidelines

## 1. The Core UX Mandate: The Application Must Explain Itself

CRM OS is built on the principle that business software should teach its own concepts in context:
- **No Mystery Metrics**: A score such as "Customer Health: 72" must never appear without an immediate breakdown of why it was calculated (e.g., `+15 High engagement`, `-8 Unresolved ticket`).
- **Data Source Transparency**: When AI provides a recommendation, it must disclose the audited data sources used (e.g., `PostgreSQL Ledger`, `Gmail Sync`, `Calendar`).
- **Explainable Actions Everywhere**: Every complex card includes an `ExplainBadge` ("Why did AI flag this?").

---

## 2. Progressive Disclosure Principles

1. **Scannable Tier-1 Overview**:
   - The user sees primary status badges, key revenue totals, and immediate action items without visual noise.
2. **Contextual Expansion on Demand**:
   - Clicking an account opens the full Customer 360 view with 10 dedicated sub-tabs (Overview, Timeline, Graph, Deals, Documents, AI Insights).
3. **No Dead-End Empty States**:
   - When no records exist in a table or list, the empty state explains *what* the entity is, *why* it matters, and provides an immediate CTA (`Add Customer`, `Connect Integration`).

---

## 3. Keyboard-First Efficiency Standards

For high-velocity sales and operations teams, all critical flows support keyboard shortcuts:
- `CMD / CTRL + K`: Open AI Command Center / Universal Search
- `CMD / CTRL + P`: Quick navigate between modules
- `ESC`: Dismiss active modal, drawer, or palette
- `Enter / ↵`: Execute query or commit selected action
- `Arrow Keys (↑ / ↓)` : Navigate search result items

---

## 4. Multi-Platform Ergonomics

- **Desktop (Tauri)**: High information density, multi-column layouts, offline sync bar, keyboard shortcuts.
- **Web (Browser)**: Adaptive responsive layouts, fast code-split transitions, bookmarkable URLs.
- **Mobile (Expo)**: Touch-optimized cards, bottom sheet drawers, focused single-column customer timelines.
