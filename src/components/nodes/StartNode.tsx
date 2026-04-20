import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { WorkflowNode } from '../../types/workflow';

const StartNode = ({ selected }: NodeProps<WorkflowNode>) => {
  return (
    <div
      className={`
        relative min-w-[160px] rounded-xl border-2 bg-white px-4 py-3 shadow-md transition-all duration-200
        ${selected ? 'border-emerald-500 shadow-emerald-200 shadow-lg ring-2 ring-emerald-200' : 'border-emerald-300 hover:shadow-lg'}
      `}
    >
      {/* Color stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-emerald-500" />

      <div className="flex items-center gap-2.5 pl-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Start</p>
          <p className="text-xs text-slate-500">Trigger point</p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !rounded-full !border-2 !border-emerald-500 !bg-white"
      />
    </div>
  );
};

export default StartNode;
