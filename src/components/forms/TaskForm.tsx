import type { TaskNodeData } from '../../types/workflow';

interface Props {
  data: TaskNodeData;
  onChange: (updates: Partial<TaskNodeData>) => void;
}

const TaskForm = ({ data, onChange }: Props) => (
  <div className="space-y-4">
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        Label
      </label>
      <input
        type="text"
        value={data.label}
        onChange={(e) => onChange({ label: e.target.value })}
        className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      />
    </div>

    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        Assignee
      </label>
      <input
        type="text"
        value={data.assignee}
        onChange={(e) => onChange({ assignee: e.target.value })}
        placeholder="e.g. john.doe@company.com"
        className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        Due in (days)
      </label>
      <input
        type="number"
        min={1}
        max={365}
        value={data.dueInDays}
        onChange={(e) => onChange({ dueInDays: parseInt(e.target.value) || 1 })}
        className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        Description
      </label>
      <textarea
        value={data.description}
        onChange={(e) => onChange({ description: e.target.value })}
        rows={3}
        placeholder="Describe the task..."
        className="w-full resize-none rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  </div>
);

export default TaskForm;
