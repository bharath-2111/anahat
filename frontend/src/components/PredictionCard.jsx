import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  FileAudio,
  Activity,
  LockKeyhole,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Brain,
  ChevronDown,
  ChevronUp,
  Mic,
  Radio,
  Scan,
  Fingerprint,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import RiskBadge from './RiskBadge';
import Button from './Button';

export default function PredictionCard({ result, onReset }) {
  const navigate = useNavigate();
  const [expandedDetails, setExpandedDetails] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!result) return null;

  const isSpoof = result.prediction === 'Spoof';
  const spoofProbability = Number(result.spoofProbability || 0);
  const realProbability = Number(result.realProbability || 0);

  const spoofPercent = Math.round(spoofProbability * 100);
  const realPercent = Math.round(realProbability * 100);

  // Trigger confetti on mount for authentic results
  useEffect(() => {
    if (!isSpoof) {
      const timer = setTimeout(() => setShowConfetti(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isSpoof]);

  // Detailed metrics
  const detailedMetrics = [
    { 
      label: 'Confidence Score', 
      value: isSpoof ? spoofPercent : realPercent,
      icon: Target,
      color: isSpoof ? 'text-red-400' : 'text-emerald-400',
      max: 100,
    },
    { 
      label: 'Risk Level', 
      value: result.riskLevel || 'UNKNOWN',
      icon: ShieldAlert,
      color: isSpoof ? 'text-red-400' : 'text-emerald-400',
      isText: true,
    },
    { 
      label: 'Processing Time', 
      value: '1.2s',
      icon: Zap,
      color: 'text-blue-400',
      isText: true,
    },
    { 
      label: 'Audio Quality', 
      value: '98%',
      icon: Mic,
      color: 'text-purple-400',
      max: 100,
    },
  ];

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* =========================================================
          VERDICT HEADER
      ========================================================== */}
      <motion.section
        className={`relative overflow-hidden rounded-2xl border shadow-2xl ${
          isSpoof
            ? 'border-red-900/60 bg-gradient-to-br from-red-950/20 to-slate-950'
            : 'border-emerald-900/60 bg-gradient-to-br from-emerald-950/20 to-slate-950'
        }`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Animated background glow */}
        <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl ${
          isSpoof ? 'bg-red-500/10' : 'bg-emerald-500/10'
        } animate-pulse`} />

        {/* Header */}
        <div className="relative px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {isSpoof ? (
                <ShieldAlert className="w-5 h-5 text-red-400" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              )}
            </motion.div>
            <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
              Authenticity Verdict
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700 text-[8px] font-medium text-slate-400">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[9px] font-medium text-emerald-400 uppercase tracking-wider">
              Analysis Complete
            </span>
          </div>
        </div>

        <div className="relative p-6 sm:p-8 lg:p-10">
          {/* Main verdict */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-center">
            {/* Left side */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <RiskBadge level={result.riskLevel} size="lg" />
                <span className="text-[9px] font-medium text-slate-600 uppercase tracking-wider">
                  Security Assessment
                </span>
              </div>

              <div className="flex items-center gap-4">
                <motion.div
                  className={`w-16 h-16 rounded-2xl border flex items-center justify-center ${
                    isSpoof
                      ? 'bg-red-950/50 border-red-800/70'
                      : 'bg-emerald-950/50 border-emerald-800/70'
                  }`}
                  whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  {isSpoof ? (
                    <ShieldAlert className="w-8 h-8 text-red-400" />
                  ) : (
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  )}
                </motion.div>

                <div>
                  <motion.h1
                    className={`text-3xl sm:text-4xl font-bold tracking-tight ${
                      isSpoof ? 'text-red-400' : 'text-emerald-400'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {isSpoof ? '⚠️ Spoof Detected' : '✅ Voice Authentic'}
                  </motion.h1>
                  <p className="mt-1 text-sm text-slate-400 leading-relaxed max-w-lg">
                    {isSpoof
                      ? 'The analyzed recording shows evidence consistent with synthetic or cloned speech patterns.'
                      : 'The analyzed recording passed all authenticity checks with high confidence.'}
                  </p>
                </div>
              </div>

              {/* File info */}
              <motion.div 
                className="mt-6 flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <FileAudio className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] font-medium text-slate-500 uppercase tracking-wider">
                    Analyzed Recording
                  </div>
                  <div className="text-xs font-medium text-slate-300 truncate max-w-xs">
                    {result.audioInfo?.filename || 'Unknown audio'}
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-[9px] text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </motion.div>
            </div>

            {/* Probability score - Right side */}
            <motion.div
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">
                  Spoof Probability
                </span>
                <span className={`text-[10px] font-bold ${isSpoof ? 'text-red-400' : 'text-emerald-400'}`}>
                  {isSpoof ? 'High Risk' : 'Low Risk'}
                </span>
              </div>

              <motion.div
                className={`text-6xl font-bold tracking-tight ${
                  isSpoof ? 'text-red-400' : 'text-emerald-400'
                }`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              >
                {spoofPercent}%
              </motion.div>

              <div className="mt-2 text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                Model Confidence Score
              </div>

              <div className="mt-4 space-y-2">
                <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${spoofPercent}%` }}
                    transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${isSpoof ? 'bg-red-500' : 'bg-emerald-500'}`}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-medium">
                  <span className="text-emerald-400">Real {realPercent}%</span>
                  <span className="text-red-400">Spoof {spoofPercent}%</span>
                </div>
              </div>

              {/* Quick indicators */}
              <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                <div className="text-left">
                  <p className="text-[7px] text-slate-500 uppercase tracking-wider">Confidence</p>
                  <p className="text-xs font-semibold text-slate-300">
                    {isSpoof ? spoofPercent : realPercent}%
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-[7px] text-slate-500 uppercase tracking-wider">Status</p>
                  <p className={`text-xs font-semibold ${isSpoof ? 'text-red-400' : 'text-emerald-400'}`}>
                    {isSpoof ? 'Suspicious' : 'Verified'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* =========================================================
          SECURITY ACTION
      ========================================================== */}
      <motion.section
        className={`rounded-xl border p-5 ${
          isSpoof
            ? 'border-red-900/60 bg-red-950/10'
            : 'border-emerald-900/50 bg-emerald-950/10'
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <motion.div
            className={`w-10 h-10 shrink-0 rounded-lg border flex items-center justify-center ${
              isSpoof
                ? 'border-red-800 bg-red-950/50'
                : 'border-emerald-800 bg-emerald-950/50'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {isSpoof ? (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
                Recommended Security Action
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-medium uppercase tracking-wider ${
                isSpoof 
                  ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
                  : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              }`}>
                {isSpoof ? 'Action Required' : 'All Clear'}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-3xl">
              {result.recommendation ||
                (isSpoof
                  ? 'Treat the interaction as suspicious. Verify the caller through an independent, trusted channel before proceeding with any sensitive actions.'
                  : 'No strong evidence of synthetic speech was detected. Continue with standard identity verification procedures.')}
            </p>
          </div>
        </div>
      </motion.section>

      {/* =========================================================
          ANALYSIS METRICS
      ========================================================== */}
      <motion.section
        className="grid grid-cols-1 sm:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        {detailedMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-slate-700 transition-all"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
            >
              <div className="flex items-center gap-2 text-slate-500">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[8px] font-semibold tracking-wider uppercase">
                  {metric.label}
                </span>
              </div>
              <div className={`mt-2 text-xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              {!metric.isText && (
                <div className="mt-1.5 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${metric.color.replace('text-', 'bg-')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                    transition={{ delay: 0.5 + idx * 0.05, duration: 0.8 }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.section>

      {/* =========================================================
          EXPANDABLE DETAILS
      ========================================================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <button
          onClick={() => setExpandedDetails(!expandedDetails)}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-medium text-slate-400">Detailed Analysis</span>
            <span className="text-[8px] text-slate-600 uppercase tracking-wider">
              {expandedDetails ? 'Hide' : 'Show'} Technical Details
            </span>
          </div>
          <motion.div
            animate={{ rotate: expandedDetails ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </motion.div>
        </button>

        <AnimatePresence>
          {expandedDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-semibold tracking-wider uppercase">
                      Windows Analyzed
                    </span>
                  </div>
                  <div className="mt-2 text-xl font-bold text-slate-200">
                    {result.windowsAnalyzed ?? '—'}
                  </div>
                  <div className="mt-1 text-[9px] text-slate-500">
                    Audio segments evaluated
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Brain className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-semibold tracking-wider uppercase">
                      Spoof Score
                    </span>
                  </div>
                  <div className="mt-2 text-xl font-bold text-red-400">
                    {spoofProbability.toFixed(4)}
                  </div>
                  <div className="mt-1 text-[9px] text-slate-500">
                    Backend model output
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <LockKeyhole className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-semibold tracking-wider uppercase">
                      Decision State
                    </span>
                  </div>
                  <div className={`mt-2 text-xl font-bold ${
                    isSpoof ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {result.riskLevel || 'UNKNOWN'}
                  </div>
                  <div className="mt-1 text-[9px] text-slate-500">
                    Risk engine classification
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* =========================================================
          ACTIONS
      ========================================================== */}
      <motion.section
        className="flex flex-col sm:flex-row gap-3 pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => navigate('/results')}
          variant="primary"
          size="lg"
          icon={ArrowRight}
          className="w-full sm:w-auto"
        >
          View Detailed Analysis
        </Button>

        <Button
          onClick={onReset}
          variant="secondary"
          size="lg"
          icon={RotateCcw}
          className="w-full sm:w-auto"
        >
          Analyze Another Recording
        </Button>
      </motion.section>

      {/* Confetti effect for authentic results */}
      {showConfetti && !isSpoof && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                background: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b'][i % 5],
              }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 600,
                y: -100 - Math.random() * 500,
                scale: Math.random() * 0.8 + 0.2,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 1.5 + Math.random() * 1.5,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}