import type { ApprovalNodeData } from '../../types/workflow';

interface Props {
  data: ApprovalNodeData;
  onChange: (updates: Partial<ApprovalNodeData>) => void;
}

const ROLES = ['manager', 'director', 'vp', 'cto', 'legal', 'finance', 'hr'];

const ApprovalForm = ({ data, onChange }: Props) => (
  <div className="space-y-4">
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        Label
      </label>
      <input
        type="text"
        value={data.label}
        onChange={(e) => onChange({ label: e.target.value })}
        className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
      />
    </div>

    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        Approver Role
      </label>
      <select
        value={data.approverRole}
        onChange={(e) => onChange({ approverRole: e.target.value })}
        className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
      >
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        Escalation Timer (minutes)
      </label>
      <input
        type="number"
        min={5}
        max={10080}
        value={data.escalationMinutes}
        onChange={(e) => onChange({ escalationMinutes: parseInt(e.target.value) || 60 })}
        className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
      />
      <p className="mt-1 text-[10px] text-slate-500">
        Auto-escalate after {data.escalationMinutes} min ({(data.escalationMinutes / 60).toFixed(1)} hrs)
      </p>
    </div>
  </div>
);

export default ApprovalForm;
