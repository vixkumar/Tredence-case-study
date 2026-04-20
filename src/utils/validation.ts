import type { WorkflowNode, WorkflowEdge, ValidationResult } from '../types/workflow';

export const validateWorkflow = (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Must have at least one node
  if (nodes.length === 0) {
    errors.push('Workflow is empty — add at least a Start and End node.');
    return { valid: false, errors, warnings };
  }

  // 2. Exactly one Start node
  const startNodes = nodes.filter((n) => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push('Missing Start node — every workflow must begin with one.');
  } else if (startNodes.length > 1) {
    errors.push(`Found ${startNodes.length} Start nodes — only one is allowed.`);
  }

  // 3. Exactly one End node
  const endNodes = nodes.filter((n) => n.type === 'end');
  if (endNodes.length === 0) {
    errors.push('Missing End node — every workflow must have a terminal node.');
  } else if (endNodes.length > 1) {
    errors.push(`Found ${endNodes.length} End nodes — only one is allowed.`);
  }

  // 4. Start node must have no incoming edges
  if (startNodes.length === 1) {
    const startId = startNodes[0].id;
    const incoming = edges.filter((e) => e.target === startId);
    if (incoming.length > 0) {
      errors.push('Start node must not have incoming connections.');
    }
  }

  // 5. End node must have no outgoing edges
  if (endNodes.length === 1) {
    const endId = endNodes[0].id;
    const outgoing = edges.filter((e) => e.source === endId);
    if (outgoing.length > 0) {
      errors.push('End node must not have outgoing connections.');
    }
  }

  // 6. All edges reference existing nodes
  const nodeIds = new Set(nodes.map((n) => n.id));
  for (const edge of edges) {
    if (!nodeIds.has(edge.source)) {
      errors.push(`Edge references missing source node: ${edge.source}`);
    }
    if (!nodeIds.has(edge.target)) {
      errors.push(`Edge references missing target node: ${edge.target}`);
    }
  }

  // 7. No disconnected nodes (all reachable from Start via BFS)
  if (startNodes.length === 1 && errors.length === 0) {
    const adjacency = new Map<string, string[]>();
    for (const edge of edges) {
      const fwd = adjacency.get(edge.source) || [];
      fwd.push(edge.target);
      adjacency.set(edge.source, fwd);

      // Also track reverse for undirected reachability
      const rev = adjacency.get(edge.target) || [];
      rev.push(edge.source);
      adjacency.set(edge.target, rev);
    }

    const visited = new Set<string>();
    const queue = [startNodes[0].id];
    while (queue.length > 0) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      const neighbors = adjacency.get(id) || [];
      for (const n of neighbors) {
        if (!visited.has(n)) queue.push(n);
      }
    }

    const disconnected = nodes.filter((n) => !visited.has(n.id));
    if (disconnected.length > 0) {
      const labels = disconnected.map((n) => `"${(n.data as { label: string }).label}"`).join(', ');
      errors.push(`Disconnected nodes found: ${labels}. All nodes must be reachable from Start.`);
    }
  }

  // Warnings
  if (nodes.length === 2 && startNodes.length === 1 && endNodes.length === 1) {
    warnings.push('Workflow only has Start → End. Consider adding processing steps.');
  }

  return { valid: errors.length === 0, errors, warnings };
};
