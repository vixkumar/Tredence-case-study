import type { StartNodeData } from '../../types/workflow';

interface Props {
  data: StartNodeData;
  onChange: (updates: Partial<StartNodeData>) => void;
}

const StartForm = ({ data, onChange }: Props) => (
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
        Trigger Type
      </label>
      <select
        value={data.triggerType}
        onChange={(e) => onChange({ triggerType: e.target.value as StartNodeData['triggerType'] })}
        className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      >
        <option value="manual">Manual</option>
        <option value="scheduled">Scheduled</option>
        <option value="webhook">Webhook</option>
      </select>
    </div>
  </div>
);

export default StartForm;
