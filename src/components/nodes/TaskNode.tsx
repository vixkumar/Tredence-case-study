import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { WorkflowNode, TaskNodeData } from '../../types/workflow';

const TaskNode = ({ data, selected }: NodeProps<WorkflowNode>) => {
  const d = data as TaskNodeData;

  return (
    <div
      className={`
        relative min-w-[180px] rounded-xl border-2 bg-white px-4 py-3 shadow-md transition-all duration-200
        ${selected ? 'border-blue-500 shadow-blue-200 shadow-lg ring-2 ring-blue-200' : 'border-blue-300 hover:shadow-lg'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !rounded-full !border-2 !border-blue-500 !bg-white"
      />

      <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-blue-500" />

      <div className="flex items-center gap-2.5 pl-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">Task</p>
          <p className="truncate text-xs font-medium text-slate-700">{d.label}</p>
          {d.assignee && (
            <p className="truncate text-[10px] text-slate-400">→ {d.assignee}</p>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !rounded-full !border-2 !border-blue-500 !bg-white"
      />
    </div>
  );
};

export default TaskNode;
