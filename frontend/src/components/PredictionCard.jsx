import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import RiskBadge from './RiskBadge';
import Button from './Button';

/**
 * Primary Prediction Result Card for Page 2 (/analyze).
 * Displays ONLY the primary result cleanly and prominently.
 */
export default function PredictionCard({ result, onReset }) {
  const navigate = useNavigate();

  if (!result) return null;

  const isSpoof = result.prediction === 'Spoof';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 sm:p-10 shadow-2xl text-center">
      
      {/* Risk Badge Top Bar */}
      <div className="flex justify-center mb-6">
        <RiskBadge level={result.riskLevel} size="lg" />
      </div>

      {/* Main Dominant Visual Element (NO GRADIENTS, STATIC SOLID COLORS) */}
      <div className="my-4">
        <div className="inline-flex p-4 rounded-full bg-slate-950 border border-slate-800 mb-4">
          {isSpoof ? (
            <ShieldAlert className="w-16 h-16 text-red-500" />
          ) : (
            <ShieldCheck className="w-16 h-16 text-emerald-500" />
          )}
        </div>

        <h2 className={`text-3xl sm:text-5xl font-mono font-extrabold tracking-tight uppercase ${
          isSpoof ? 'text-red-500' : 'text-emerald-500'
        }`}>
          {isSpoof ? 'SPOOF DETECTED' : 'REAL VOICE'}
        </h2>

        <p className="text-sm font-mono text-slate-300 mt-3 max-w-lg mx-auto">
          {isSpoof
            ? 'Acoustic spectral signals indicate AI voice cloning or synthetic speech.'
            : 'Vocal pitch and vocal fold harmonics match natural human speech patterns.'}
        </p>
      </div>

      {/* Target Audio Meta Line */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-slate-400 my-6">
        <span className="text-slate-500">TARGET FILE:</span>
        <span className="text-slate-200 font-bold truncate max-w-xs">{result.audioInfo.filename}</span>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-slate-800">
        <Button
          onClick={() => navigate('/results')}
          variant="primary"
          size="lg"
          icon={ArrowRight}
          className="w-full sm:w-auto"
        >
          VIEW DETAILED ANALYSIS
        </Button>

        <Button
          onClick={onReset}
          variant="secondary"
          size="lg"
          icon={RotateCcw}
          className="w-full sm:w-auto"
        >
          ANALYZE ANOTHER AUDIO
        </Button>
      </div>
    </div>
  );
}
