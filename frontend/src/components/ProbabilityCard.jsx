import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import { formatProbability } from '../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Target,
  Gauge,
  Brain,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Activity,
  BarChart3,
  PieChart,
} from 'lucide-react';

/**
 * Probability Breakdown Card for Page 3 (/results).
 * Visualizes Spoof % and Real % with animated bars and premium UI.
 */
export default function ProbabilityCard({ spoofProbability = 0, realProbability = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);

  const spoofPercent = Math.min(100, Math.max(0, spoofProbability * 100));
  const realPercent = Math.min(100, Math.max(0, realProbability * 100));

  const isSpoofHigh = spoofPercent > 70;
  const isRealHigh = realPercent > 70;
  const isBalanced = spoofPercent > 30 && spoofPercent < 70;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Determine risk level
  const getRiskLevel = () => {
    if (isSpoofHigh) return { label: 'High Risk', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: AlertTriangle };
    if (isRealHigh) return { label: 'Low Risk', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 };
    return { label: 'Medium Risk', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: Activity };
  };

  const riskInfo = getRiskLevel();
  const RiskIcon = riskInfo.icon;

  // Additional metrics
  const metrics = [
    {
      label: 'Confidence Gap',
      value: Math.abs(spoofPercent - realPercent).toFixed(0) + '%',
      icon: Gauge,
      color: Math.abs(spoofPercent - realPercent) > 30 ? 'text-emerald-400' : 'text-yellow-400',
    },
    {
      label: 'Detection Status',
      value: isSpoofHigh ? 'Spoof Detected' : isRealHigh ? 'Authentic' : 'Inconclusive',
      icon: isSpoofHigh ? ShieldAlert : isRealHigh ? ShieldCheck : Activity,
      color: isSpoofHigh ? 'text-red-400' : isRealHigh ? 'text-emerald-400' : 'text-yellow-400',
    },
  ];

  return (
    <Card 
      title="Acoustic Probability Distribution" 
      subtitle="Normalized backend neural confidence evaluation"
      className="overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl ${
          isSpoofHigh ? 'bg-red-500/5' : isRealHigh ? 'bg-emerald-500/5' : 'bg-yellow-500/5'
        }`} />
      </div>

      <div className="relative space-y-6">
        {/* Header with risk indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${riskInfo.bg}`}>
              <RiskIcon className={`w-4 h-4 ${riskInfo.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Risk Assessment</p>
              <p className={`text-sm font-bold ${riskInfo.color}`}>{riskInfo.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">Confidence</span>
            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${isSpoofHigh ? 'bg-red-400' : isRealHigh ? 'bg-emerald-400' : 'bg-yellow-400'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(spoofPercent, realPercent)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Spoof Probability Bar */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -10 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onMouseEnter={() => setHoveredBar('spoof')}
          onMouseLeave={() => setHoveredBar(null)}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                Spoof Probability
              </span>
              {isSpoofHigh && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[8px] font-bold text-red-400 uppercase tracking-wider">
                  High
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <motion.span
                key={spoofPercent}
                className="text-sm font-bold text-red-400"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {formatProbability(spoofProbability)}
              </motion.span>
              {hoveredBar === 'spoof' && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[8px] text-slate-500 uppercase tracking-wider"
                >
                  {spoofPercent}%
                </motion.span>
              )}
            </div>
          </div>

          <div className="relative w-full bg-slate-950 border border-slate-800 h-5 rounded-lg overflow-hidden p-0.5">
            <motion.div
              className="h-full rounded-md bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-500/10"
              initial={{ width: 0 }}
              animate={{ width: `${spoofPercent}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            />
            {/* Glow effect on bar */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 pointer-events-none"
              style={{ opacity: spoofPercent > 50 ? 0.5 : 0 }}
            />
          </div>
        </motion.div>

        {/* Real Probability Bar */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -10 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onMouseEnter={() => setHoveredBar('real')}
          onMouseLeave={() => setHoveredBar(null)}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Real Probability
              </span>
              {isRealHigh && (
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-bold text-emerald-400 uppercase tracking-wider">
                  High
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <motion.span
                key={realPercent}
                className="text-sm font-bold text-emerald-400"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.1 }}
              >
                {formatProbability(realProbability)}
              </motion.span>
              {hoveredBar === 'real' && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[8px] text-slate-500 uppercase tracking-wider"
                >
                  {realPercent}%
                </motion.span>
              )}
            </div>
          </div>

          <div className="relative w-full bg-slate-950 border border-slate-800 h-5 rounded-lg overflow-hidden p-0.5">
            <motion.div
              className="h-full rounded-md bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-lg shadow-emerald-500/10"
              initial={{ width: 0 }}
              animate={{ width: `${realPercent}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />
            <div 
              className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 pointer-events-none"
              style={{ opacity: realPercent > 50 ? 0.5 : 0 }}
            />
          </div>
        </motion.div>

        {/* Visual indicators */}
        {isBalanced && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-yellow-500/5 border border-yellow-500/10 text-yellow-400"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[9px] font-medium uppercase tracking-wider">
              Balanced probabilities detected
            </span>
          </motion.div>
        )}

        {/* Metrics Grid */}
        <motion.div
          className="grid grid-cols-2 gap-3 pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl hover:border-slate-700 transition-all"
                whileHover={{ y: -2, scale: 1.01 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${metric.color}`} />
                    <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider">
                      {metric.label}
                    </span>
                  </div>
                  <motion.span
                    key={metric.value}
                    className={`text-xs font-bold ${metric.color}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {metric.value}
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Net Scores */}
        <motion.div
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <div className="relative overflow-hidden bg-red-500/5 border border-red-500/20 p-4 rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/5" />
            <div className="relative">
              <span className="text-[8px] font-bold text-red-400/70 uppercase tracking-wider">NET SPOOF SCORE</span>
              <motion.p
                key={spoofProbability}
                className="text-lg font-bold text-red-400"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {(spoofProbability).toFixed(4)}
              </motion.p>
              <div className="mt-1 h-0.5 w-8 bg-red-400/30 rounded-full" />
            </div>
          </div>

          <div className="relative overflow-hidden bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/5" />
            <div className="relative">
              <span className="text-[8px] font-bold text-emerald-400/70 uppercase tracking-wider">NET REAL SCORE</span>
              <motion.p
                key={realProbability}
                className="text-lg font-bold text-emerald-400"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.05 }}
              >
                {(realProbability).toFixed(4)}
              </motion.p>
              <div className="mt-1 h-0.5 w-8 bg-emerald-400/30 rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Mini chart visualization */}
        <motion.div
          className="pt-2 border-t border-slate-800/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[8px] text-slate-500 uppercase tracking-wider">Spoof</span>
                <span className="text-[8px] font-bold text-red-400">{spoofPercent}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[8px] text-slate-500 uppercase tracking-wider">Real</span>
                <span className="text-[8px] font-bold text-emerald-400">{realPercent}%</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="w-3 h-3 text-slate-500" />
              <span className="text-[8px] font-medium text-slate-500 uppercase tracking-wider">
                {Math.max(spoofPercent, realPercent) > 70 ? 'High Confidence' : 'Inconclusive'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </Card>
  );
}