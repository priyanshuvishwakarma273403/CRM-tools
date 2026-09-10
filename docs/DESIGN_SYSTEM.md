# CRM OS — Design System & Tokens Specification

## 1. Design Token Philosophy

CRM OS provides an original, calm, information-dense, and highly legible visual system inspired by the precision of Linear and the clarity of Stripe, without cloning any layout or assets.

---

## 2. Color Palette & Token Scale

### Primary Brand
- `brand-500`: `#3b6bec` — Primary interactive controls
- `brand-600`: `#2552df` — Primary active buttons and key indicators
- `brand-950`: `#101c47` — Subtle dark mode accent surface

### Autonomous AI & Copilot Layer
- `ai-500`: `#8b5cf6` — AI glow, copilot highlights, model status
- `ai-950`: `#1e1b4b` — Dark mode AI card surface
- `ai-gradient`: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)`

### Semantic Feedback Tokens
- **Success (Emerald)**: `#047857` (light text) / `#34d399` (dark text) — Closed won, verified SSO, approved actions
- **Warning (Amber)**: `#b45309` (light text) / `#fbbf24` (dark text) — Medium risk, pending approvals, churn warnings
- **Error / High Risk (Crimson)**: `#b91c1c` (light text) / `#f87171` (dark text) — Churn critical, security checkpoints
- **Info (Sky Blue)**: `#0369a1` (light text) / `#38bdf8` (dark text) — Integrations sync, calendar events

### Surface Contrast Matrix
| Layer | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| **Canvas Background** | `#f8fafc` | `#090d16` |
| **Primary Surface** | `#ffffff` | `#0f172a` |
| **Subtle Card Surface** | `#f1f5f9` | `#1e293b` |
| **Border Line** | `#e2e8f0` | `#1e293b` |
| **High Contrast Text** | `#0f172a` | `#f8fafc` |
| **Secondary Text** | `#475569` | `#cbd5e1` |
| **Monospace / Muted** | `#94a3b8` | `#64748b` |

---

## 3. Typography Scales

- **Display Hero**: `Plus Jakarta Sans`, 3.5rem (56px), Line-height 1.08, Letter-spacing -0.035em
- **Section Headers (H1)**: 2.25rem (36px), Line-height 1.2, Letter-spacing -0.025em
- **Module Titles (H2)**: 1.75rem (28px), Line-height 1.25, Letter-spacing -0.02em
- **Card Headlines (H3)**: 1.25rem (20px), Line-height 1.35, Letter-spacing -0.015em
- **Body Regular**: `Inter`, 0.875rem (14px), Line-height 1.5
- **Dense Data & Tables**: `Inter`, 0.8125rem (13px), Line-height 1.4
- **Technical & Identifiers**: `JetBrains Mono`, 0.75rem (12px)

---

## 4. Component Catalog

1. **`ExplainBadge`**: Inline contextual explainability pill that triggers an audit evidence drawer with positive/negative driver weights and data source citations.
2. **`CustomerHealthBreakdown`**: Interactive health score widget with transparent point allocation (`+15 engagement`, `-8 ticket SLA breach`).
3. **`RelationshipGraph`**: Expandable entity tree displaying contacts, deals, tickets, and contracts.
4. **`CentralTimeline`**: Multi-channel chronological event stream.
5. **`AgentExecutionStepper`**: Animated 8-step visual runner for autonomous AI agent tasks.
6. **`McpActionConfirmationDialog`**: High-security checkpoint modal for external tool mutations.
7. **`WorkflowVisualBuilder`**: Interactive trigger-condition-action-AI-MCP pipeline editor.
8. **`ArchitectureDiagram`**: Clickable full-stack topology visualizer.
9. **`IntegrationConnectModal`**: 5-step guided connection wizard.
