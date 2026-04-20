import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { WorkflowNode } from '../../types/workflow';

const EndNode = ({ selected }: NodeProps<WorkflowNode>) => {
  return (
    <div
      className={`
        relative min-w-[160px] rounded-xl border-2 bg-white px-4 py-3 shadow-md transition-all duration-200
        ${selected ? 'border-rose-500 shadow-rose-200 shadow-lg ring-2 ring-rose-200' : 'border-rose-300 hover:shadow-lg'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !rounded-full !border-2 !border-rose-500 !bg-white"
      />

      <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-rose-500" />

      <div className="flex items-center gap-2.5 pl-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-600">End</p>
          <p className="text-xs text-slate-500">Terminal</p>
        </div>
      </div>
    </div>
  );
};

export default EndNode;
