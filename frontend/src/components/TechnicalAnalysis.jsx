import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import { 
  Cpu, 
  Activity, 
  BarChart3, 
  Gauge, 
  Zap, 
  Brain,
  Target,
  Shield,
  Mic,
  Radio,
  Scan,
  Fingerprint,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Icon mapping based on key names
const getIconForKey = (key) => {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes('accuracy') || lowerKey.includes('confidence')) return Target;
  if (lowerKey.includes('performance') || lowerKey.includes('speed')) return Zap;
  if (lowerKey.includes('risk') || lowerKey.includes('threat')) return Shield;
  if (lowerKey.includes('neural') || lowerKey.includes('model') || lowerKey.includes('ai')) return Brain;
  if (lowerKey.includes('spectral') || lowerKey.includes('frequency')) return Radio;
  if (lowerKey.includes('feature') || lowerKey.includes('vector')) return Fingerprint;
  if (lowerKey.includes('processing') || lowerKey.includes('latency')) return Gauge;
  if (lowerKey.includes('detection') || lowerKey.includes('analysis')) return Scan;
  return Cpu;
};

// Color mapping based on values
const getValueColor = (key, value) => {
  const lowerKey = key.toLowerCase();
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  
  if (lowerKey.includes('accuracy') || lowerKey.includes('confidence')) {
    if (numValue > 80) return 'text-emerald-400';
    if (numValue > 60) return 'text-yellow-400';
    return 'text-red-400';
  }
  if (lowerKey.includes('risk')) {
    if (value === 'High' || value === 'Critical') return 'text-red-400';
    if (value === 'Medium') return 'text-yellow-400';
    return 'text-emerald-400';
  }
  if (lowerKey.includes('status')) {
    if (value === 'Success' || value === 'Complete' || value === 'Pass') return 'text-emerald-400';
    if (value === 'Warning' || value === 'Pending') return 'text-yellow-400';
    if (value === 'Error' || value === 'Fail') return 'text-red-400';
  }
  return 'text-slate-200';
};

// Format value for display
const formatValue = (key, value) => {
  if (typeof value === 'boolean') {
    return value ? '✓ True' : '✗ False';
  }
  if (typeof value === 'number') {
    if (key.toLowerCase().includes('probability') || key.toLowerCase().includes('confidence')) {
      return `${(value * 100).toFixed(1)}%`;
    }
    if (Number.isInteger(value)) {
      return value.toString();
    }
    return value.toFixed(3);
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

export default function TechnicalAnalysis({ additionalData }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredKey, setHoveredKey] = useState(null);

  if (!additionalData || Object.keys(additionalData).length === 0) {
    return (
      <Card 
        title="Technical Analysis Metrics" 
        subtitle="Extended neural feature extraction parameters"
        className="overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-600">
              <Brain className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium text-slate-300">No Extended Parameters</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Additional telemetry data was not returned by the backend for this analysis sample.
            </p>
          </motion.div>
        </div>
      </Card>
    );
  }

  const entries = Object.entries(additionalData);
  const totalMetrics = entries.length;

  return (
    <Card 
      title="Technical Analysis Metrics" 
      subtitle={`${totalMetrics} extended parameters from neural inference`}
      className="overflow-hidden"
    >
      {/* Header with expand toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
            Acoustic & Neural Features
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[8px] font-bold text-slate-400">
            {totalMetrics}
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500 hover:text-slate-300 transition-colors"
        >
          {isExpanded ? (
            <>
              Collapse
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Expand
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Metrics Grid */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {entries.map(([key, value], index) => {
              const Icon = getIconForKey(key);
              const formattedKey = key
                .replace(/_/g, ' ')
                .replace(/([A-Z])/g, ' $1')
                .trim()
                .toUpperCase();
              const formattedValue = formatValue(key, value);
              const valueColor = getValueColor(key, value);
              const isNumeric = typeof value === 'number';
              const isBoolean = typeof value === 'boolean';
              const isObject = typeof value === 'object' && value !== null;

              return (
                <motion.div
                  key={key}
                  className={`group relative bg-slate-950/70 border border-slate-800 rounded-xl p-4 transition-all duration-300 ${
                    hoveredKey === key ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/5' : ''
                  }`}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onMouseEnter={() => setHoveredKey(key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  whileHover={{ y: -2 }}
                >
                  {/* Background glow on hover */}
                  {hoveredKey === key && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-xl bg-emerald-500/5 pointer-events-none"
                    />
                  )}

                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg transition-colors ${
                        hoveredKey === key 
                          ? 'bg-emerald-500/10 border border-emerald-500/20' 
                          : 'bg-slate-900/50 border border-slate-800'
                      }`}>
                        <Icon className={`w-3.5 h-3.5 transition-colors ${
                          hoveredKey === key ? 'text-emerald-400' : 'text-slate-500'
                        }`} />
                      </div>
                      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider flex-1 truncate">
                        {formattedKey}
                      </span>
                    </div>

                    {/* Value */}
                    <div className="flex items-end justify-between">
                      <div className="space-y-0.5">
                        <motion.span 
                          className={`text-sm font-bold ${valueColor} block truncate`}
                          key={formattedValue}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {formattedValue}
                        </motion.span>
                        
                        {/* Type indicator */}
                        <span className="text-[8px] font-medium text-slate-600 uppercase tracking-wider">
                          {isNumeric ? 'Numeric' : isBoolean ? 'Boolean' : isObject ? 'Object' : 'Text'}
                        </span>
                      </div>

                      {/* Progress bar for numeric values */}
                      {isNumeric && typeof value === 'number' && value >= 0 && value <= 1 && (
                        <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              value > 0.8 ? 'bg-emerald-400' :
                              value > 0.5 ? 'bg-yellow-400' :
                              'bg-red-400'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${value * 100}%` }}
                            transition={{ duration: 0.8, delay: index * 0.05 }}
                          />
                        </div>
                      )}

                      {/* Status indicator for boolean */}
                      {isBoolean && (
                        <div className={`w-2 h-2 rounded-full ${
                          value ? 'bg-emerald-400' : 'bg-red-400'
                        }`} />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer with summary */}
      <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[9px] text-slate-500">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Neural inference complete
          </span>
          <span className="w-px h-3 bg-slate-700" />
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            {totalMetrics} parameters extracted
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-medium text-slate-600 uppercase tracking-wider">
            Model v3.2
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>
    </Card>
  );
}