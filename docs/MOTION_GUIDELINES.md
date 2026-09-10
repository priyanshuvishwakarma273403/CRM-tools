# CRM OS — Motion Design & Animation Specification

## 1. Motion Philosophy: Meaning Over Decoration

Animation in CRM OS communicates real-time system state and teaches users what the platform is doing:
- **No Idle Bouncing**: Animations are functional, fast, and purposeful.
- **Micro-durations**: Hover and click interactions complete in &le; 150ms to maintain instant responsiveness.
- **Physical Spring Physics**: Modal entrances and drawer slide-outs use natural damping (`damping: 25, stiffness: 300`) to avoid rigid robotic motion.

---

## 2. Animation Token Catalog

| Animation | Duration | Easing Curve | Purpose |
| :--- | :--- | :--- | :--- |
| **`fade-in`** | 200ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Dropdown menus, tooltips, toasts |
| **`slide-up`** | 300ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Modals, drawers, command palette |
| **`pulse-glow`**| 2500ms| `ease-in-out infinite` | AI copilot active indicator |
| **`stepper`**   | 550ms | Sequential step delay | Visual AI agent execution runner |

---

## 3. Framer Motion Implementation Rules

1. **Hardware Acceleration**:
   - Transitions strictly animate `transform` (`translateY`, `scale`) and `opacity`. Never animate `width`, `height`, `top`, or `left` to prevent expensive layout reflows.
2. **Layout Animations (`layoutId`)**:
   - Used for tab highlight pills (e.g. Pipeline vs Customer 360) and Kanban card drags.
3. **Reduced Motion Compliance**:
   - The CSS framework enforces `@media (prefers-reduced-motion: reduce)` rules globally, overriding durations to `0.01ms` for users with motion sensitivities.
