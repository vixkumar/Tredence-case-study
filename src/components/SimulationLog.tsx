import type { SimulationResult } from '../types/workflow';

interface Props {
  result: SimulationResult | null;
  error: string | null;
  onClose: () => void;
}

const STATUS_STYLES = {
  success: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-500', icon: '✓' },
  warning: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-500', icon: '⚠' },
  error: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-500', icon: '✗' },
};

const TYPE_LABELS: Record<string, string> = {
  start: 'START',
  task: 'TASK',
  approval: 'APPROVAL',
  automated: 'AUTO',
  end: 'END',
};

const SimulationLog = ({ result, error, onClose }: Props) => {
  if (!result && !error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="mx-4 w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${result?.success ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <h2 className="text-base font-semibold text-white">Simulation Results</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Steps */}
        {result && (
          <>
            <div className="max-h-[400px] overflow-y-auto px-6 py-4">
              <div className="space-y-3">
                {result.steps.map((step, i) => {
                  const s = STATUS_STYLES[step.status];
                  return (
                    <div
                      key={`${step.nodeId}-${i}`}
                      className={`rounded-xl border border-slate-700/50 ${s.bg} p-3 transition-all`}
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Step number */}
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
                          {i + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold ${s.text}`}>{step.label}</span>
                            <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                              {TYPE_LABELS[step.type] || step.type}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-400">{step.message}</p>
                        </div>

                        {/* Status icon */}
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${s.bg} text-sm ${s.text}`}>
                          {s.icon}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-slate-700 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{result.steps.length} steps executed</span>
                  <span>Duration: {(result.totalDuration / 1000).toFixed(1)}s</span>
                </div>
                <div className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  result.success
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {result.success ? 'Passed' : 'Failed'}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SimulationLog;
