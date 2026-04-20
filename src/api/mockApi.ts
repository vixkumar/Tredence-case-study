import type {
  AutomationAction,
  SimulationResult,
  SimulationStep,
  WorkflowNode,
  WorkflowEdge,
  NodeVariant,
} from '../types/workflow';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── GET /automations ────────────────────────────────────────────────────────

const AUTOMATIONS: AutomationAction[] = [
  {
    id: 'send_email',
    name: 'Send Email',
    description: 'Sends a templated email to the specified recipient.',
    parameterSchema: { to: 'string', subject: 'string', template: 'string' },
  },
  {
    id: 'generate_doc',
    name: 'Generate Document',
    description: 'Creates a PDF or DOCX from a predefined template.',
    parameterSchema: { templateId: 'string', format: 'string' },
  },
  {
    id: 'slack_notify',
    name: 'Slack Notification',
    description: 'Posts a message to a Slack channel.',
    parameterSchema: { channel: 'string', message: 'string' },
  },
  {
    id: 'create_ticket',
    name: 'Create Ticket',
    description: 'Creates a support ticket in the issue tracker.',
    parameterSchema: { title: 'string', priority: 'string', assignee: 'string' },
  },
];

export const getAutomations = async (): Promise<AutomationAction[]> => {
  await delay(300);
  return [...AUTOMATIONS];
};

// ─── POST /simulate ──────────────────────────────────────────────────────────

const STATUS_MESSAGES: Record<NodeVariant, { status: SimulationStep['status']; message: string }[]> = {
  start: [{ status: 'success', message: 'Workflow triggered successfully.' }],
  task: [
    { status: 'success', message: 'Task assigned and completed by assignee.' },
    { status: 'warning', message: 'Task completed but exceeded due date.' },
  ],
  approval: [
    { status: 'success', message: 'Approval granted by authorized role.' },
    { status: 'warning', message: 'Approval pending — escalation timer started.' },
    { status: 'error', message: 'Approval denied. Workflow halted.' },
  ],
  automated: [
    { status: 'success', message: 'Automation executed successfully.' },
    { status: 'error', message: 'Automation failed — invalid parameters.' },
  ],
  end: [{ status: 'success', message: 'Workflow completed.' }],
};

export const simulateWorkflow = async (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): Promise<SimulationResult> => {
  await delay(400);

  // Build adjacency
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    const list = adjacency.get(edge.source) || [];
    list.push(edge.target);
    adjacency.set(edge.source, list);
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const startNode = nodes.find((n) => n.type === 'start');

  if (!startNode) {
    return { success: false, steps: [], totalDuration: 0 };
  }

  // BFS traversal
  const visited = new Set<string>();
  const queue: string[] = [startNode.id];
  const steps: SimulationStep[] = [];
  let time = Date.now();

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    const node = nodeMap.get(id);
    if (!node) continue;

    const variant = node.type as NodeVariant;
    const possibilities = STATUS_MESSAGES[variant] || [{ status: 'success' as const, message: 'Processed.' }];
    const pick = possibilities[Math.floor(Math.random() * possibilities.length)];

    steps.push({
      nodeId: id,
      label: (node.data as { label: string }).label,
      type: variant,
      status: pick.status,
      message: pick.message,
      timestamp: time,
    });

    // If this step errored, halt simulation
    if (pick.status === 'error') {
      return {
        success: false,
        steps,
        totalDuration: time - steps[0].timestamp,
      };
    }

    time += 800 + Math.floor(Math.random() * 400);

    const children = adjacency.get(id) || [];
    for (const child of children) {
      if (!visited.has(child)) queue.push(child);
    }
  }

  return {
    success: true,
    steps,
    totalDuration: steps.length > 0 ? time - steps[0].timestamp : 0,
  };
};
