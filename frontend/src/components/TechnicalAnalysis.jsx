import React from 'react';
import Card from './Card';
import { Cpu } from 'lucide-react';

/**
 * Flexible Technical Analysis Card for Page 3 (/results).
 * Renders any extra fields returned by the backend in a clean grid.
 */
export default function TechnicalAnalysis({ additionalData }) {
  if (!additionalData || Object.keys(additionalData).length === 0) {
    return (
      <Card title="Technical Analysis Metrics" subtitle="Extended neural feature extraction parameters">
        <div className="bg-slate-950 border border-slate-800 p-4 rounded text-center text-xs font-mono text-slate-500">
          No additional extended parameters returned by the backend for this sample.
        </div>
      </Card>
    );
  }

  return (
    <Card title="Technical Analysis Metrics" subtitle="Dynamic backend model telemetry & acoustic features">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {Object.entries(additionalData).map(([key, value]) => {
          const formattedKey = key
            .replace(/_/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .toUpperCase();

          const formattedValue = typeof value === 'object'
            ? JSON.stringify(value)
            : String(value);

          return (
            <div key={key} className="bg-slate-950 border border-slate-800 p-3 rounded">
              <div className="flex items-center space-x-1.5 mb-1 text-slate-500">
                <Cpu className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-mono font-bold tracking-wider truncate">
                  {formattedKey}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-200 truncate block">
                {formattedValue}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
