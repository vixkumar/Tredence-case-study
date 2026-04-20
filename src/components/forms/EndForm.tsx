import type { EndNodeData } from '../../types/workflow';

interface Props {
  data: EndNodeData;
  onChange: (updates: Partial<EndNodeData>) => void;
}

const EndForm = ({ data, onChange }: Props) => (
  <div className="space-y-4">
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        Label
      </label>
      <input
        type="text"
        value={data.label}
        onChange={(e) => onChange({ label: e.target.value })}
        className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
      />
    </div>

    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        Terminal Status
      </label>
      <select
        value={data.status}
        onChange={(e) => onChange({ status: e.target.value as EndNodeData['status'] })}
        className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white outline-none transition focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
      >
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
        <option value="failed">Failed</option>
      </select>
    </div>
  </div>
);

export default EndForm;
