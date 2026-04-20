import { useCallback, useRef, type DragEvent } from 'react';
import { ReactFlow, ReactFlowProvider, Background, Controls, MiniMap, type ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from './components/nodes';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import NodeConfigPanel from './components/forms/NodeConfigPanel';
import SimulationLog from './components/SimulationLog';
import ValidationPanel from './components/ValidationPanel';

import { useWorkflow } from './hooks/useWorkflow';
import { useSimulation } from './hooks/useSimulation';
import type { NodeVariant, WorkflowNode, WorkflowEdge } from './types/workflow';

const FlowCanvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance<WorkflowNode, WorkflowEdge> | null>(null);

  const {
    nodes,
    edges,
    selectedNode,
    validationResult,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeData,
    validate,
    clearValidation,
  } = useWorkflow();

  const { result: simResult, isSimulating, error: simError, simulate, clearSimulation } = useSimulation();

  // ─── Drop handler ──────────────────────────────────────────────────────

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();

      const variant = e.dataTransfer.getData('application/reactflow-variant') as NodeVariant;
      if (!variant) return;

      if (!reactFlowInstance.current) return;

      const position = reactFlowInstance.current.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      addNode(variant, position);
    },
    [addNode],
  );

  const onInit = useCallback((instance: ReactFlowInstance<WorkflowNode, WorkflowEdge>) => {
    reactFlowInstance.current = instance;
  }, []);

  // ─── Deselect handler for closing panel ─────────────────────────────────

  const handleClosePanel = useCallback(() => {
    onNodesChange(
      nodes
        .filter((n) => n.selected)
        .map((n) => ({ type: 'select' as const, id: n.id, selected: false })),
    );
  }, [nodes, onNodesChange]);

  // ─── Simulate ───────────────────────────────────────────────────────────

  const handleSimulate = useCallback(() => {
    simulate(nodes, edges);
  }, [simulate, nodes, edges]);

  return (
    <div className="flex h-screen w-screen bg-slate-50">
      {/* Left sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        <Toolbar
          onValidate={validate}
          onSimulate={handleSimulate}
          isSimulating={isSimulating}
          validationResult={validationResult}
          onClearValidation={clearValidation}
          nodeCount={nodes.length}
          edgeCount={edges.length}
        />

        {/* Canvas + Config Panel */}
        <div className="flex flex-1 overflow-hidden">
          <div ref={reactFlowWrapper} className="flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={onInit}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              deleteKeyCode={['Backspace', 'Delete']}
              className="bg-slate-50"
              defaultEdgeOptions={{
                animated: true,
                style: { stroke: '#6366f1', strokeWidth: 2 },
              }}
            >
              <Background color="#cbd5e1" gap={20} size={1} />
              <Controls className="!rounded-xl !border-slate-200 !bg-white !shadow-lg" />
              <MiniMap
                className="!rounded-xl !border-slate-200 !bg-white !shadow-lg"
                nodeColor={(node) => {
                  const colors: Record<string, string> = {
                    start: '#10b981',
                    task: '#3b82f6',
                    approval: '#f59e0b',
                    automated: '#8b5cf6',
                    end: '#f43f5e',
                  };
                  return colors[node.type || ''] || '#94a3b8';
                }}
              />
            </ReactFlow>
          </div>

          {/* Config panel (right side) */}
          <NodeConfigPanel
            node={selectedNode}
            onUpdate={updateNodeData}
            onClose={handleClosePanel}
          />
        </div>
      </div>

      {/* Validation errors panel */}
      {validationResult && !validationResult.valid && (
        <ValidationPanel result={validationResult} onClose={clearValidation} />
      )}

      {/* Simulation log modal */}
      <SimulationLog result={simResult} error={simError} onClose={clearSimulation} />
    </div>
  );
};

const App = () => (
  <ReactFlowProvider>
    <FlowCanvas />
  </ReactFlowProvider>
);

export default App;
