# FlowCraft — HR Workflow Designer

A **zero-to-one** visual workflow builder for HR automation pipelines, built with React, TypeScript, React Flow v12, and Tailwind CSS v4.

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)
![React Flow](https://img.shields.io/badge/React%20Flow-v12-ff0071?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type-check
npx tsc --noEmit

# Production build
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Features

### 1. Custom Node Types

Five distinct, color-coded node types with specialized handles:

| Node | Color | Source Handle | Target Handle | Purpose |
|------|-------|:---:|:---:|---------|
| **Start** | Emerald | ✓ | — | Workflow entry point (trigger type: manual / scheduled / webhook) |
| **Task** | Blue | ✓ | ✓ | Manual human step with assignee, due date, description |
| **Approval** | Amber | ✓ | ✓ | Gate check with approver role selection and escalation timer |
| **Automated Step** | Violet | ✓ | ✓ | System action (email, doc gen, Slack, tickets) with dynamic parameters |
| **End** | Rose | — | ✓ | Terminal node with status (completed / cancelled / failed) |

### 2. Dynamic Form Engine

Selecting any node on the canvas opens a **side panel** that renders the correct configuration form based on node type:

- **Start** → Trigger type dropdown
- **Task** → Assignee field, due-in-days, description textarea
- **Approval** → Approver role dropdown (manager, director, VP, CTO, legal, finance, HR), escalation timer
- **Automated Step** → Action selector (populated from mock `GET /automations`), **dynamic parameter fields** based on the selected action's schema
- **End** → Terminal status dropdown

Changes save automatically — no submit button needed.

### 3. Drag-and-Drop Sidebar

The left sidebar contains draggable cards for each node type. Uses HTML5 `dataTransfer` API:
- `onDragStart` sets the node variant
- `onDrop` on the canvas reads the variant and calls `screenToFlowPosition` for accurate placement

### 4. Mock API Layer

| Endpoint | Function | Behavior |
|----------|----------|----------|
| `GET /automations` | `getAutomations()` | Returns 4 actions: `send_email`, `generate_doc`, `slack_notify`, `create_ticket` — each with a `parameterSchema` |
| `POST /simulate` | `simulateWorkflow(nodes, edges)` | BFS traversal from Start node, returns step-by-step `SimulationResult` with randomized success/warning/error outcomes |

Both endpoints simulate network latency (300–400ms).

### 5. Workflow Validation

The `validateWorkflow()` utility enforces:

1. **Non-empty** — at least one node required
2. **Single Start node** — exactly one, no incoming edges
3. **Single End node** — exactly one, no outgoing edges
4. **Edge integrity** — all edges reference existing nodes
5. **Connectivity** — BFS from Start to ensure no disconnected nodes
6. **Warnings** — flags trivially simple Start→End-only workflows

Results shown via a floating toast panel with error/warning badges.

### 6. Simulation Sandbox

Click **Simulate** (after passing validation) to:
1. Serialize the current canvas (nodes + edges)
2. POST to the mock `simulateWorkflow` endpoint
3. Display a **modal with step-by-step execution log** — each step shows node name, type badge, status icon (✓ / ⚠ / ✗), and descriptive message
4. Summary footer with step count, duration, and pass/fail badge

If any step errors (e.g., "Approval denied"), the simulation halts and reports failure.

---

## Architecture

```
src/
├── api/
│   └── mockApi.ts              # Mock GET /automations + POST /simulate
├── components/
│   ├── nodes/
│   │   ├── StartNode.tsx       # Emerald, source-only handle
│   │   ├── TaskNode.tsx        # Blue, shows assignee
│   │   ├── ApprovalNode.tsx    # Amber, shows approver role
│   │   ├── AutomatedStepNode.tsx # Violet, shows action ID
│   │   ├── EndNode.tsx         # Rose, target-only handle
│   │   └── index.ts            # nodeTypes registry for React Flow
│   ├── forms/
│   │   ├── NodeConfigPanel.tsx # Dynamic form shell (switches on node.type)
│   │   ├── StartForm.tsx       # Trigger type config
│   │   ├── TaskForm.tsx        # Assignee, due date, description
│   │   ├── ApprovalForm.tsx    # Approver role, escalation timer
│   │   ├── AutomatedStepForm.tsx # Action select + dynamic params from API
│   │   └── EndForm.tsx         # Terminal status config
│   ├── Sidebar.tsx             # Draggable node palette
│   ├── Toolbar.tsx             # Validate + Simulate buttons, stats
│   ├── SimulationLog.tsx       # Step-by-step results modal
│   └── ValidationPanel.tsx     # Floating error/warning toast
├── hooks/
│   ├── useWorkflow.ts          # Centralized React Flow state management
│   └── useSimulation.ts        # Simulation trigger + result state
├── types/
│   └── workflow.ts             # All TypeScript interfaces
├── utils/
│   └── validation.ts           # Graph validation logic (BFS connectivity)
├── App.tsx                     # App shell: sidebar + canvas + config panel
├── main.tsx                    # React entry point
└── index.css                   # Tailwind import + custom animations
```

---

## Design Decisions

### State Management: React Flow's Built-in Hooks

**Why not Zustand or Redux?**

React Flow v12 provides `useNodesState` and `useEdgesState` — purpose-built hooks that handle node/edge CRUD, selection, dragging, and change batching internally. Wrapping these in a third-party store would add an unnecessary abstraction layer without meaningful benefit for this scope.

Instead, the `useWorkflow` custom hook composes React Flow's hooks with application-specific logic (add, update, validate, delete) into a single, clean interface. This keeps the state **co-located with the rendering library** and avoids synchronization bugs between two state systems.

**Trade-off:** For a production app with undo/redo, collaborative editing, or persistence, Zustand with middleware would be the right upgrade path.

### TypeScript: Discriminated Union for Node Data

Each node type has its own strict data interface (`StartNodeData`, `TaskNodeData`, etc.) unified under a `NodeData` discriminated union via the `variant` field. This gives:
- **Compile-time exhaustiveness** checking in switch statements
- **Per-form type narrowing** without unsafe casts
- **Self-documenting** node schemas

All data interfaces extend `Record<string, unknown>` to satisfy React Flow v12's generic constraint.

### Dynamic Form Engine: Component Switching

Rather than a schema-driven form renderer, the config panel uses **explicit component switching** (`switch (variant)`). This was chosen because:
- Each form has **different field types** (dropdowns, textareas, dynamic parameter grids)
- The Automated Step form has an **async dependency** (fetching actions from the API)
- Explicit components are easier to debug and maintain than a generic renderer

### Simulation: BFS Graph Traversal

The mock simulation uses **Breadth-First Search** from the Start node to walk the graph in topological order. Each node produces a randomized outcome based on its type. This demonstrates:
- Correct graph serialization
- Order-of-execution awareness
- Error halting behavior (simulation stops on first error)

---

## Assumptions

1. **Single Start + Single End**: The validator enforces exactly one of each. Real workflows might support multiple end states — this is a deliberate simplification for the prototype.

2. **Mock API is client-side**: `getAutomations()` and `simulateWorkflow()` are pure TypeScript functions with `setTimeout` delays. No actual HTTP calls are made. In production, these would be replaced with `fetch`/`axios` calls to real endpoints.

3. **Randomized simulation outcomes**: The simulation randomly picks success/warning/error for each node type to demonstrate all possible UI states. A real simulator would evaluate actual business rules.

4. **No persistence**: Workflows are held in React state only. Refreshing the page resets to the starter workflow. A production version would persist to localStorage or a backend.

5. **Parameter schemas are string-typed**: The `parameterSchema` in automation actions maps field names to `"string"` types. A production version would support richer types (number, enum, boolean) with appropriate form controls.

---

## Future Scope

With more development time, the following enhancements would be prioritized:

| Priority | Feature | Description |
|:---:|---------|-------------|
| 🔴 | **Undo/Redo** | Integrate with Zustand temporal middleware or React Flow's built-in history |
| 🔴 | **Persistence** | Save/load workflows to localStorage or a backend API |
| 🟡 | **Auto-Layout** | Use dagre or ELK.js for automatic graph layout on import |
| 🟡 | **Conditional Edges** | Label edges with conditions (e.g., "If approved → next", "If denied → end") |
| 🟡 | **Real API Integration** | Replace mock functions with actual REST/GraphQL endpoints |
| 🟢 | **Node Grouping** | Sub-workflows or collapsible node groups |
| 🟢 | **Collaborative Editing** | WebSocket-based real-time collaboration |
| 🟢 | **Export/Import** | JSON/YAML export of workflow definitions |
| 🟢 | **Dark Mode** | Leverage React Flow v12's built-in `colorMode` prop |
| 🟢 | **Testing** | Vitest unit tests for validation + hooks, Playwright E2E tests |

---

## Tech Stack

| Dependency | Version | Purpose |
|------------|---------|---------|
| `react` | 18.x | UI framework |
| `@xyflow/react` | 12.x | Flow canvas, nodes, edges, handles |
| `tailwindcss` | 4.x | Utility-first CSS |
| `@tailwindcss/vite` | 4.x | Vite plugin for Tailwind |
| `vite` | 8.x | Dev server and bundler |
| `typescript` | 5.x | Type safety |

---

## License

MIT
# Tredence-case-study
