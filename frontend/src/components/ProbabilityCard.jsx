import React from 'react';
import Card from './Card';
import { formatProbability } from '../utils/formatters';

/**
 * Probability Breakdown Card for Page 3 (/results).
 * Visualizes Spoof % and Real % with solid static bars (No Gradients).
 */
export default function ProbabilityCard({ spoofProbability = 0, realProbability = 0 }) {
  const spoofPercent = Math.min(100, Math.max(0, spoofProbability * 100));
  const realPercent = Math.min(100, Math.max(0, realProbability * 100));

  return (
    <Card title="Acoustic Probability Distribution" subtitle="Normalized backend neural confidence evaluation">
      <div className="space-y-6">
        
        {/* Spoof Probability Bar */}
        <div>
          <div className="flex justify-between items-center mb-2 font-mono text-xs">
            <span className="text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" />
              SPOOF PROBABILITY
            </span>
            <span className="text-red-400 font-extrabold text-sm">
              {formatProbability(spoofProbability)}
            </span>
          </div>

          <div className="w-full bg-slate-950 border border-slate-800 h-4 rounded overflow-hidden p-0.5">
            <div
              className="bg-red-600 h-full rounded-sm transition-all duration-500"
              style={{ width: `${spoofPercent}%` }}
            />
          </div>
        </div>

        {/* Real Probability Bar */}
        <div>
          <div className="flex justify-between items-center mb-2 font-mono text-xs">
            <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
              REAL PROBABILITY
            </span>
            <span className="text-emerald-400 font-extrabold text-sm">
              {formatProbability(realProbability)}
            </span>
          </div>

          <div className="w-full bg-slate-950 border border-slate-800 h-4 rounded overflow-hidden p-0.5">
            <div
              className="bg-emerald-600 h-full rounded-sm transition-all duration-500"
              style={{ width: `${realPercent}%` }}
            />
          </div>
        </div>

        {/* Comparative Stat Cards */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">NET SPOOF SCORE</span>
            <span className="text-lg font-mono font-bold text-red-400">
              {(spoofProbability).toFixed(4)}
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">NET REAL SCORE</span>
            <span className="text-lg font-mono font-bold text-emerald-400">
              {(realProbability).toFixed(4)}
            </span>
          </div>
        </div>

      </div>
    </Card>
  );
}
