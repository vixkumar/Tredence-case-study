import type { ValidationResult } from '../types/workflow';

interface Props {
  onValidate: () => ValidationResult;
  onSimulate: () => void;
  isSimulating: boolean;
  validationResult: ValidationResult | null;
  onClearValidation: () => void;
  nodeCount: number;
  edgeCount: number;
}

const Toolbar = ({
  onValidate,
  onSimulate,
  isSimulating,
  validationResult,
  onClearValidation,
  nodeCount,
  edgeCount,
}: Props) => {
  const handleValidateAndSimulate = () => {
    const result = onValidate();
    if (result.valid) {
      onSimulate();
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-5 py-2.5 backdrop-blur-sm">
      {/* Left: Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          <span>{nodeCount} nodes</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          <span>{edgeCount} edges</span>
        </div>
      </div>

      {/* Center: Validation result */}
      {validationResult && (
        <div className="flex items-center gap-2">
          {validationResult.valid ? (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Valid workflow
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {validationResult.errors.length} error{validationResult.errors.length !== 1 ? 's' : ''}
            </div>
          )}
          {validationResult.warnings.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              ⚠ {validationResult.warnings.length} warning{validationResult.warnings.length !== 1 ? 's' : ''}
            </div>
          )}
          <button
            onClick={onClearValidation}
            className="ml-1 text-slate-400 transition hover:text-slate-600"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onValidate()}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow active:scale-[0.97]"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Validate
        </button>

        <button
          onClick={handleValidateAndSimulate}
          disabled={isSimulating}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSimulating ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Running…
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Simulate
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
