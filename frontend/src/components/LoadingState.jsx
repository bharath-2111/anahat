import React from 'react';
import { Activity, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Professional Loading State for Audio Analysis
 */
export default function LoadingState() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-10 text-center shadow-2xl">
      
      {/* Animated Technical Radar Pulse (Static Green - No Gradients) */}
      <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        {/* Ring 1 */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 border border-emerald-500 rounded-full"
        />
        
        {/* Ring 2 */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-2 border border-slate-700 rounded-full"
        />

        {/* Center Icon */}
        <div className="w-12 h-12 bg-slate-950 border border-emerald-500/80 rounded-full flex items-center justify-center text-emerald-400 z-10">
          <Activity className="w-6 h-6 animate-pulse text-emerald-400" />
        </div>
      </div>

      <h3 className="text-xl font-mono font-bold text-slate-100 tracking-wider uppercase">
        ANALYZING VOICE SIGNAL
      </h3>
      
      <p className="text-xs font-mono text-emerald-400 mt-2">
        EXTRACTING ACOUSTIC SPECTRAL FEATURES & SYNTHETIC PATTERNS...
      </p>

      {/* Simulated Pipeline Steps */}
      <div className="mt-8 max-w-sm mx-auto space-y-2 text-left">
        {[
          '1. Loading PCM audio waveform into Fast Fourier Transform pipeline...',
          '2. Computing Mel-Frequency Cepstral Coefficients (MFCC)...',
          '3. Evaluating neural deepfake acoustic distortion vectors...',
          '4. Dispatching tensor features to FastAPI backend classifier...'
        ].map((step, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
            <Cpu className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            <span className="truncate">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
