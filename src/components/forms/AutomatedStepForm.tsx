import { useEffect, useState } from 'react';
import type { AutomatedNodeData, AutomationAction } from '../../types/workflow';
import { getAutomations } from '../../api/mockApi';

interface Props {
  data: AutomatedNodeData;
  onChange: (updates: Partial<AutomatedNodeData>) => void;
}

const AutomatedStepForm = ({ data, onChange }: Props) => {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAutomations().then((list) => {
      setAutomations(list);
      setLoading(false);
    });
  }, []);

  const selectedAction = automations.find((a) => a.id === data.actionId);

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Label
        </label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => onChange({ label: e.target.value })}
          className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Automation Action
        </label>
        {loading ? (
          <div className="flex items-center gap-2 py-2 text-xs text-slate-500">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            Loading automations…
          </div>
        ) : (
          <select
            value={data.actionId}
            onChange={(e) => {
              const action = automations.find((a) => a.id === e.target.value);
              const params: Record<string, string> = {};
              if (action) {
                Object.keys(action.parameterSchema).forEach((k) => (params[k] = ''));
              }
              onChange({ actionId: e.target.value, parameters: params });
            }}
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          >
            <option value="">Select an action…</option>
            {automations.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        )}
        {selectedAction && (
          <p className="mt-1 text-[10px] text-slate-500">{selectedAction.description}</p>
        )}
      </div>

      {/* Dynamic parameter fields */}
      {selectedAction && Object.keys(selectedAction.parameterSchema).length > 0 && (
        <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-800/50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">
            Parameters
          </p>
          {Object.entries(selectedAction.parameterSchema).map(([key, type]) => (
            <div key={key}>
              <label className="mb-1 block text-xs text-slate-400">
                {key} <span className="text-slate-600">({type})</span>
              </label>
              <input
                type="text"
                value={data.parameters[key] || ''}
                onChange={(e) =>
                  onChange({ parameters: { ...data.parameters, [key]: e.target.value } })
                }
                placeholder={`Enter ${key}…`}
                className="w-full rounded-md border border-slate-600 bg-slate-700/50 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutomatedStepForm;
