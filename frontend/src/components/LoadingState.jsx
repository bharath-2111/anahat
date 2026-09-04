import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AudioWaveform,
  BrainCircuit,
  ShieldAlert,
  CheckCircle2,
  Activity,
  Sparkles,
  Zap,
  Gauge,
  Target,
  Clock,
  Radio,
  Scan,
  Fingerprint,
} from 'lucide-react';

const stages = [
  {
    id: 0,
    icon: AudioWaveform,
    title: 'AUDIO INGESTION',
    description: 'Reading and preparing the submitted voice signal.',
    shortDesc: 'Loading audio file...',
    progressWeight: 12,
  },
  {
    id: 1,
    icon: Activity,
    title: 'SIGNAL PROCESSING',
    description: 'Normalizing the audio for model inference.',
    shortDesc: 'Processing waveform...',
    progressWeight: 20,
  },
  {
    id: 2,
    icon: BrainCircuit,
    title: 'AI DETECTION',
    description: 'Evaluating synthetic speech indicators.',
    shortDesc: 'Neural inference in progress...',
    progressWeight: 35,
  },
  {
    id: 3,
    icon: ShieldAlert,
    title: 'RISK ASSESSMENT',
    description: 'Converting detection confidence into security risk.',
    shortDesc: 'Analyzing threat vectors...',
    progressWeight: 33,
  },
];

// Simulated real-time metrics
const metricsData = [
  { label: 'Signal Quality', value: '98%', icon: Radio },
  { label: 'Noise Floor', value: '-42dB', icon: Gauge },
  { label: 'Confidence', value: '87%', icon: Target },
  { label: 'Processing', value: '0.8s', icon: Zap },
];

export default function LoadingState() {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [metrics, setMetrics] = useState(metricsData);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  // Calculate stage progress
  useEffect(() => {
    const totalDuration = 25000; // 15 seconds
    const interval = 100; // Update every 100ms
    let startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      
      setProgress(newProgress);
      setElapsedTime(elapsed);

      // Update current stage based on progress
      let cumulativeWeight = 0;
      let stageIndex = 0;
      for (let i = 0; i < stages.length; i++) {
        cumulativeWeight += stages[i].progressWeight;
        if (newProgress <= cumulativeWeight * (100 / 100)) {
          stageIndex = i;
          break;
        }
        if (i === stages.length - 1) stageIndex = i;
      }
      setCurrentStage(stageIndex);

      // Update metrics dynamically with smoother changes
      // Update metrics dynamically with smoother changes
const signalQuality = 85 + Math.floor(Math.random() * 14);
const confidence = 80 + Math.floor(Math.random() * 18);

setMetrics([
  { label: 'Signal Quality', value: `${signalQuality}%`, icon: Radio },
  { label: 'Noise Floor', value: `${-38 - Math.floor(Math.random() * 8)}dB`, icon: Gauge },
  { label: 'Confidence', value: `${confidence}%`, icon: Target },
  { label: 'Processing', value: `${(0.5 + Math.random() * 0.8).toFixed(1)}s`, icon: Zap },
]);

      // Check if complete
      if (newProgress >= 100) {
        setIsComplete(true);
        setShowSparkles(true);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
  if (isComplete) return;

  const metricTimer = setInterval(() => {
    const signalQuality = 85 + Math.floor(Math.random() * 10);
    const confidence = 82 + Math.floor(Math.random() * 8);

    setMetrics([
      {
        label: 'Signal Quality',
        value: `${signalQuality}%`,
        icon: Radio,
      },
      {
        label: 'Noise Floor',
        value: `${-40 - Math.floor(Math.random() * 5)}dB`,
        icon: Gauge,
      },
      {
        label: 'Confidence',
        value: `${confidence}%`,
        icon: Target,
      },
      {
        label: 'Processing',
        value: `${(0.7 + Math.random() * 0.4).toFixed(1)}s`,
        icon: Zap,
      },
    ]);
  }, 1800);

  return () => clearInterval(metricTimer);
}, [isComplete]);

  // Stage status helper
  const getStageStatus = (stageId) => {
    if (stageId < currentStage) return 'complete';
    if (stageId === currentStage && !isComplete) return 'active';
    return 'pending';
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="text-[10px] font-semibold tracking-[0.18em] text-emerald-400 uppercase">
            Analysis in progress
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-medium text-emerald-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-500">
            {Math.floor(elapsedTime / 1000)}s / 15s
          </span>
          <span className="text-[9px] font-medium text-slate-600 uppercase tracking-wider">
            VoxShield Engine
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 lg:p-10">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Left - Visual */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
              {/* Outer rotating ring - slower */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 20,
                  ease: 'linear',
                }}
                className="absolute inset-0 rounded-full border border-dashed border-emerald-500/30"
              />

              {/* Middle ring - counter rotating slower */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  repeat: Infinity,
                  duration: 14,
                  ease: 'linear',
                }}
                className="absolute inset-5 rounded-full border border-slate-700"
              />

              {/* Pulse ring - slower pulse */}
              <motion.div
                animate={{
                  scale: [0.95, 1.05, 0.95],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: 'easeInOut',
                }}
                className="absolute inset-12 rounded-full border border-emerald-500/40"
              />

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="w-20 h-20 rounded-full bg-slate-950 border border-emerald-500/30 flex items-center justify-center"
                  animate={{
                    scale: isComplete ? [1, 1.08, 1] : 1,
                  }}
                  transition={{
                    repeat: isComplete ? Infinity : 0,
                    duration: 2.5,
                    ease: 'easeInOut',
                  }}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  ) : (
                    <BrainCircuit className="w-10 h-10 text-emerald-400" />
                  )}
                </motion.div>
              </div>

              {/* Orbiting dots - slower with smoother motion */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 5 + i * 2,
                    ease: 'linear',
                    delay: i * 0.8,
                  }}
                  className="absolute inset-0"
                >
                  <div 
                    className={`absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      i === 0 ? 'bg-emerald-400 shadow-lg shadow-emerald-500/50' :
                      i === 1 ? 'bg-blue-400 shadow-lg shadow-blue-500/30' :
                      'bg-purple-400 shadow-lg shadow-purple-500/30'
                    }`}
                  />
                </motion.div>
              ))}

              {/* Sparkle effect on complete */}
              <AnimatePresence>
                {showSparkles && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Sparkles className="w-16 h-16 text-emerald-400 animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Circle */}
            <div className="mt-4 w-48">
              <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[8px] text-slate-600">0%</span>
                <span className="text-[8px] font-mono text-emerald-400">
                  {Math.round(progress)}%
                </span>
                <span className="text-[8px] text-slate-600">100%</span>
              </div>
            </div>
          </div>

          {/* Right - Info */}
          <div className="space-y-6">
            {/* Status Text */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-medium tracking-[0.18em] text-emerald-400 uppercase">
                  {isComplete ? 'Analysis Complete' : stages[currentStage].title}
                </span>
                {isComplete && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[8px] font-bold text-emerald-400 uppercase tracking-wider">
                    Success
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white">
                {isComplete ? 'Voice Authenticity Verified' : 'Examining Voice Authenticity'}
              </h2>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                {isComplete 
                  ? 'The recording has been analyzed. Results are ready for review.'
                  : stages[currentStage].shortDesc
                }
              </p>
            </div>

            {/* Real-time Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.label}
                    className="bg-slate-800/30 border border-slate-800 rounded-xl p-3"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3 h-3 text-slate-500" />
                        <span className="text-[8px] font-medium text-slate-500 uppercase tracking-wider">
                          {metric.label}
                        </span>
                      </div>
                      <motion.span 
                        className="text-[10px] font-semibold text-slate-200"
                        key={metric.value}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                      >
                        {metric.value}
                      </motion.span>
                    </div>
                    {/* Mini bar for numeric values */}
                    {metric.label !== 'Processing' && (
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-emerald-400/50 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${metric.label === 'Signal Quality' ? parseInt(metric.value) : 
                                    metric.label === 'Confidence' ? parseInt(metric.value) : 
                                    65 + Math.random() * 20}%` 
                          }}
                          transition={{ duration: 1.5, ease: 'easeInOut' }}
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Stage Progress Indicators */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {stages.map((stage, idx) => {
                const Icon = stage.icon;
                const status = getStageStatus(idx);
                const isActive = status === 'active';
                const isComplete = status === 'complete';
                
                return (
                  <motion.div
                    key={stage.id}
                    className={`p-3 rounded-xl border transition-all duration-500 ${
                      isComplete 
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : isActive
                        ? 'border-emerald-500/40 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                        : 'border-slate-800 bg-slate-800/20 opacity-50'
                    }`}
                    animate={isActive ? {
                      scale: [1, 1.02, 1],
                      transition: { 
                        repeat: Infinity, 
                        duration: 4.5,
                        ease: 'easeInOut'
                      }
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${
                        isComplete ? 'text-emerald-400' :
                        isActive ? 'text-emerald-400' :
                        'text-slate-600'
                      }`} />
                      {isComplete ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isActive ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ) : (
                        <span className="text-[8px] font-mono text-slate-600">Wait</span>
                      )}
                    </div>
                    <p className={`mt-2 text-[8px] font-semibold uppercase tracking-wider ${
                      isComplete || isActive ? 'text-slate-200' : 'text-slate-600'
                    }`}>
                      {stage.title.replace(' ', '\n')}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {isComplete ? 'Analysis completed' : `Estimated ${Math.round((15000 - elapsedTime) / 1000)}s remaining`}
            </span>
            <span className="w-px h-4 bg-slate-800" />
            <span className="flex items-center gap-1.5">
              <Scan className="w-3 h-3 text-emerald-400" />
              Real-time monitoring
            </span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-medium text-slate-600 uppercase tracking-wider">
            {isComplete ? (
              <span className="text-emerald-400">Ready for results</span>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Processing pipeline
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}