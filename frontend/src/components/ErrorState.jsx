import React from 'react';
import { AlertTriangle, RefreshCw, ToggleRight } from 'lucide-react';
import Button from './Button';
import { useAnalysis } from '../context/AnalysisContext';

/**
 * Error State display component for failed FastAPI operations
 */
export default function ErrorState({ error, onRetry }) {
  const { toggleMockMode } = useAnalysis();

  const handleUseMock = () => {
    toggleMockMode(true);
    if (onRetry) onRetry();
  };

  return (
    <div className="bg-slate-900 border border-red-900/60 rounded-lg p-8 text-center shadow-2xl">
      <div className="w-14 h-14 bg-red-950 border border-red-800 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-mono font-bold text-red-400 tracking-wider uppercase">
        {error?.title || 'ANALYSIS FAILED'}
      </h3>

      <p className="text-xs font-mono text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
        {error?.message || 'The analysis request could not be processed by the server.'}
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          onClick={onRetry}
          variant="danger"
          size="md"
          icon={RefreshCw}
        >
          TRY AGAIN
        </Button>

        <Button
          onClick={handleUseMock}
          variant="secondary"
          size="md"
          icon={ToggleRight}
        >
          TEST WITH OFFLINE MOCK
        </Button>
      </div>
    </div>
  );
}
