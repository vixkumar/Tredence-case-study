import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { WorkflowNode, ApprovalNodeData } from '../../types/workflow';

const ApprovalNode = ({ data, selected }: NodeProps<WorkflowNode>) => {
  const d = data as ApprovalNodeData;

  return (
    <div
      className={`
        relative min-w-[180px] rounded-xl border-2 bg-white px-4 py-3 shadow-md transition-all duration-200
        ${selected ? 'border-amber-500 shadow-amber-200 shadow-lg ring-2 ring-amber-200' : 'border-amber-300 hover:shadow-lg'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !rounded-full !border-2 !border-amber-500 !bg-white"
      />

      <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-amber-500" />

      <div className="flex items-center gap-2.5 pl-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">Approval</p>
          <p className="truncate text-xs font-medium text-slate-700">{d.label}</p>
          {d.approverRole && (
            <p className="truncate text-[10px] text-slate-400">⚑ {d.approverRole}</p>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !rounded-full !border-2 !border-amber-500 !bg-white"
      />
    </div>
  );
};

export default ApprovalNode;
