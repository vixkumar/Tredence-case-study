import type { WorkflowNode, NodeData } from '../../types/workflow';
import StartForm from './StartForm';
import TaskForm from './TaskForm';
import ApprovalForm from './ApprovalForm';
import AutomatedStepForm from './AutomatedStepForm';
import EndForm from './EndForm';
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
} from '../../types/workflow';

interface Props {
  node: WorkflowNode | null;
  onUpdate: (nodeId: string, data: Partial<NodeData>) => void;
  onClose: () => void;
}

const ACCENT_DOT: Record<string, string> = {
  start: 'bg-emerald-500',
  task: 'bg-blue-500',
  approval: 'bg-amber-500',
  automated: 'bg-violet-500',
  end: 'bg-rose-500',
};

const NodeConfigPanel = ({ node, onUpdate, onClose }: Props) => {
  if (!node) return null;

  const variant = node.type || 'task';
  const dotClass = ACCENT_DOT[variant] || 'bg-slate-500';

  const handleChange = (updates: Partial<NodeData>) => {
    onUpdate(node.id, updates);
  };

  const renderForm = () => {
    switch (variant) {
      case 'start':
        return <StartForm data={node.data as StartNodeData} onChange={handleChange} />;
      case 'task':
        return <TaskForm data={node.data as TaskNodeData} onChange={handleChange} />;
      case 'approval':
        return <ApprovalForm data={node.data as ApprovalNodeData} onChange={handleChange} />;
      case 'automated':
        return <AutomatedStepForm data={node.data as AutomatedNodeData} onChange={handleChange} />;
      case 'end':
        return <EndForm data={node.data as EndNodeData} onChange={handleChange} />;
      default:
        return <p className="text-sm text-slate-500">No configuration available.</p>;
    }
  };

  return (
    <div className="flex h-full w-80 flex-col border-l border-slate-700 bg-slate-800/95 backdrop-blur-sm animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
          <h3 className="text-sm font-semibold text-white capitalize">{variant} Node</h3>
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-700 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ID badge */}
      <div className="border-b border-slate-700/50 px-4 py-2">
        <p className="text-[10px] font-mono text-slate-500">ID: {node.id}</p>
      </div>

      {/* Form body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {renderForm()}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 px-4 py-3">
        <p className="text-center text-[10px] text-slate-600">
          Changes save automatically
        </p>
      </div>
    </div>
  );
};

export default NodeConfigPanel;
