import { useCallback, useMemo, useState } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type OnNodesChange,
  type OnEdgesChange,
} from '@xyflow/react';
import type {
  WorkflowNode,
  WorkflowEdge,
  NodeVariant,
  NodeData,
  ValidationResult,
} from '../types/workflow';
import { createDefaultNodeData } from '../types/workflow';
import { validateWorkflow } from '../utils/validation';

// ─── Initial Elements ────────────────────────────────────────────────────────

const INITIAL_NODES: WorkflowNode[] = [
  {
    id: 'node_start',
    type: 'start',
    position: { x: 300, y: 50 },
    data: { variant: 'start', label: 'Start', triggerType: 'manual' },
  },
  {
    id: 'node_task1',
    type: 'task',
    position: { x: 280, y: 200 },
    data: { variant: 'task', label: 'Review Request', assignee: 'john.doe@company.com', dueInDays: 3, description: 'Review the incoming request and prepare documentation.' },
  },
  {
    id: 'node_approval',
    type: 'approval',
    position: { x: 270, y: 360 },
    data: { variant: 'approval', label: 'Manager Approval', approverRole: 'manager', escalationMinutes: 120 },
  },
  {
    id: 'node_auto',
    type: 'automated',
    position: { x: 280, y: 520 },
    data: { variant: 'automated', label: 'Send Notification', actionId: 'send_email', parameters: { to: 'team@company.com', subject: 'Request Approved', template: 'approval_confirmation' } },
  },
  {
    id: 'node_end',
    type: 'end',
    position: { x: 310, y: 680 },
    data: { variant: 'end', label: 'Complete', status: 'completed' },
  },
];

const INITIAL_EDGES: WorkflowEdge[] = [
  { id: 'e-start-task', source: 'node_start', target: 'node_task1', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
  { id: 'e-task-approval', source: 'node_task1', target: 'node_approval', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
  { id: 'e-approval-auto', source: 'node_approval', target: 'node_auto', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
  { id: 'e-auto-end', source: 'node_auto', target: 'node_end', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
];

// ─── Counter ─────────────────────────────────────────────────────────────────

let nodeIdCounter = 100;
const getNextId = () => `node_${++nodeIdCounter}`;

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useWorkflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>(INITIAL_EDGES);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  // ─── Derived: selected node ──────────────────────────────────────────────

  const selectedNode = useMemo(
    () => nodes.find((n) => n.selected) ?? null,
    [nodes],
  );

  // ─── Connect two nodes ──────────────────────────────────────────────────

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: true,
            style: { stroke: '#6366f1', strokeWidth: 2 },
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  // ─── Add a new node ─────────────────────────────────────────────────────

  const addNode = useCallback(
    (variant: NodeVariant, position: { x: number; y: number }) => {
      const newNode: WorkflowNode = {
        id: getNextId(),
        type: variant,
        position,
        data: createDefaultNodeData(variant),
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes],
  );

  // ─── Update node data ───────────────────────────────────────────────────

  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<NodeData>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...data } as NodeData } : n,
        ),
      );
    },
    [setNodes],
  );

  // ─── Delete selected nodes ──────────────────────────────────────────────

  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => {
      const remaining = new Set(nodes.filter((n) => !n.selected).map((n) => n.id));
      return eds.filter((e) => remaining.has(e.source) && remaining.has(e.target));
    });
  }, [setNodes, setEdges, nodes]);

  // ─── Validate ───────────────────────────────────────────────────────────

  const validate = useCallback(() => {
    const result = validateWorkflow(nodes, edges);
    setValidationResult(result);
    return result;
  }, [nodes, edges]);

  const clearValidation = useCallback(() => setValidationResult(null), []);

  return {
    // State
    nodes,
    edges,
    selectedNode,
    validationResult,

    // Handlers
    onNodesChange: onNodesChange as OnNodesChange<WorkflowNode>,
    onEdgesChange: onEdgesChange as OnEdgesChange<WorkflowEdge>,
    onConnect,

    // Actions
    addNode,
    updateNodeData,
    deleteSelected,
    validate,
    clearValidation,
  };
};
