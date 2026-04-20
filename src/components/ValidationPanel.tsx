import type { ValidationResult } from '../types/workflow';

interface Props {
  result: ValidationResult;
  onClose: () => void;
}

const ValidationPanel = ({ result, onClose }: Props) => {
  if (result.errors.length === 0 && result.warnings.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-full max-w-md -translate-x-1/2 animate-slide-up">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Validation Issues</h3>
          <button
            onClick={onClose}
            className="flex h-5 w-5 items-center justify-center rounded text-slate-400 transition hover:text-slate-600"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {result.errors.map((err, i) => (
            <div key={`e-${i}`} className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-xs text-red-700">{err}</p>
            </div>
          ))}
          {result.warnings.map((warn, i) => (
            <div key={`w-${i}`} className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2">
              <span className="mt-0.5 shrink-0 text-xs text-amber-500">⚠</span>
              <p className="text-xs text-amber-700">{warn}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;
