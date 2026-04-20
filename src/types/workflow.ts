import type { Node, Edge } from '@xyflow/react';

// ─── Node Variants ───────────────────────────────────────────────────────────

export type NodeVariant = 'start' | 'task' | 'approval' | 'automated' | 'end';

// ─── Per-Variant Data Shapes ─────────────────────────────────────────────────
// Each interface must satisfy Record<string, unknown> for React Flow v12

export interface StartNodeData extends Record<string, unknown> {
  variant: 'start';
  label: string;
  triggerType: 'manual' | 'scheduled' | 'webhook';
}

export interface TaskNodeData extends Record<string, unknown> {
  variant: 'task';
  label: string;
  assignee: string;
  dueInDays: number;
  description: string;
}

export interface ApprovalNodeData extends Record<string, unknown> {
  variant: 'approval';
  label: string;
  approverRole: string;
  escalationMinutes: number;
}

export interface AutomatedNodeData extends Record<string, unknown> {
  variant: 'automated';
  label: string;
  actionId: string;
  parameters: Record<string, string>;
}

export interface EndNodeData extends Record<string, unknown> {
  variant: 'end';
  label: string;
  status: 'completed' | 'cancelled' | 'failed';
}

// ─── Discriminated Union ─────────────────────────────────────────────────────

export type NodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

// ─── Workflow Node (extends React Flow Node) ────────────────────────────────

export type WorkflowNode = Node<NodeData, NodeVariant>;

// ─── Workflow Edge ───────────────────────────────────────────────────────────

export type WorkflowEdge = Edge;

// ─── Automation Actions (from GET /automations) ─────────────────────────────

export interface AutomationAction {
  id: string;
  name: string;
  description: string;
  parameterSchema: Record<string, string>;
}

// ─── Simulation Types ────────────────────────────────────────────────────────

export interface SimulationStep {
  nodeId: string;
  label: string;
  type: NodeVariant;
  status: 'success' | 'warning' | 'error';
  message: string;
  timestamp: number;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  totalDuration: number;
}

// ─── Validation ──────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ─── Node Defaults Factory ───────────────────────────────────────────────────

export const createDefaultNodeData = (variant: NodeVariant): NodeData => {
  switch (variant) {
    case 'start':
      return { variant: 'start', label: 'Start', triggerType: 'manual' };
    case 'task':
      return { variant: 'task', label: 'New Task', assignee: '', dueInDays: 3, description: '' };
    case 'approval':
      return { variant: 'approval', label: 'Approval Gate', approverRole: 'manager', escalationMinutes: 60 };
    case 'automated':
      return { variant: 'automated', label: 'Automation', actionId: '', parameters: {} };
    case 'end':
      return { variant: 'end', label: 'End', status: 'completed' };
  }
};
