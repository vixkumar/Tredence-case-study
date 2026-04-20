import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { WorkflowNode, AutomatedNodeData } from '../../types/workflow';

const AutomatedStepNode = ({ data, selected }: NodeProps<WorkflowNode>) => {
  const d = data as AutomatedNodeData;

  return (
    <div
      className={`
        relative min-w-[180px] rounded-xl border-2 bg-white px-4 py-3 shadow-md transition-all duration-200
        ${selected ? 'border-violet-500 shadow-violet-200 shadow-lg ring-2 ring-violet-200' : 'border-violet-300 hover:shadow-lg'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !rounded-full !border-2 !border-violet-500 !bg-white"
      />

      <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-violet-500" />

      <div className="flex items-center gap-2.5 pl-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-600">Automated</p>
          <p className="truncate text-xs font-medium text-slate-700">{d.label}</p>
          {d.actionId && (
            <p className="truncate text-[10px] text-slate-400">⚡ {d.actionId}</p>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !rounded-full !border-2 !border-violet-500 !bg-white"
      />
    </div>
  );
};

export default AutomatedStepNode;
