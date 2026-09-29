import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import {
  Activity,
  ArrowRight,
  AudioLines,
  CheckCircle2,
  Clock3,
  FileAudio,
  Radio,
  Shield,
  ShieldAlert,
  Sparkles,
  Upload,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { userData, analysisResult } = useAnalysis();

  const userName = userData?.name?.split(' ')[0] || 'Operator';

  const stats = [
    {
      label: 'System status',
      value: 'Operational',
      detail: 'Detection engine ready',
      icon: Activity,
      status: 'good',
    },
    {
      label: 'Current session',
      value: analysisResult ? '1 analysis' : 'No analyses',
      detail: 'Activity in this session',
      icon: FileAudio,
      status: 'neutral',
    },
    {
      label: 'Protection mode',
      value: 'Active',
      detail: 'Voice impersonation defense',
      icon: Shield,
      status: 'good',
    },
  ];

  return (
    <main className="min-h-screen bg-[#080b10] text-slate-100">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-32 w-[520px] h-[520px] rounded-full bg-emerald-500/[0.035] blur-3xl" />
        <div className="absolute bottom-[-300px] left-[-180px] w-[600px] h-[600px] rounded-full bg-slate-500/[0.025] blur-3xl" />
      </div>

      {/* Navigation */}
        <Navbar />
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">

        {/* Welcome */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

            <span className="text-[10px] uppercase tracking-[0.18em] text-emerald-400">
              Security operations
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.04em] text-slate-50">
                Welcome back, {userName}.
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl leading-6">
                Your voice security environment is ready. Analyze an audio
                recording, monitor a live interaction, or review previous
                detection results.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              System operational
            </div>
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="grid md:grid-cols-3 gap-4 mb-6"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-800/90 bg-[#0d1118]/90 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>

                  {stat.status === 'good' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500/70" />
                  )}
                </div>

                <p className="mt-5 text-[10px] uppercase tracking-[0.14em] text-slate-600">
                  {stat.label}
                </p>

                <p className="mt-1 text-xl font-semibold text-slate-200">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  {stat.detail}
                </p>
              </div>
            );
          })}
        </motion.section>

        {/* Primary actions */}
        <section className="grid lg:grid-cols-[1.35fr_0.65fr] gap-5 mb-6">

          {/* Analyze */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.07] to-[#0d1118] p-7 lg:p-8"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.035] rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <AudioLines className="w-5 h-5 text-emerald-400" />
              </div>

              <p className="mt-7 text-[10px] uppercase tracking-[0.16em] text-emerald-400">
                Primary analysis
              </p>

              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-100">
                Analyze a voice recording
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 max-w-xl">
                Upload an audio recording and let Anahat evaluate whether
                the speech contains signs of synthetic or manipulated voice
                generation.
              </p>

              <button
                onClick={() => navigate('/analyze')}
                className="mt-7 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold transition-colors"
              >
                Start analysis
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Live */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="rounded-2xl border border-slate-800/90 bg-[#0d1118]/90 p-7"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Radio className="w-5 h-5 text-slate-400" />
            </div>

            <p className="mt-7 text-[10px] uppercase tracking-[0.16em] text-slate-600">
              Real-time protection
            </p>

            <h2 className="mt-2 text-xl font-semibold text-slate-200">
              Live Detection
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Monitor an ongoing voice interaction for potential impersonation
              signals.
            </p>

            <button
              onClick={() => navigate('/live')}
              className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors"
            >
              Open live detection
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </section>

        {/* Recent activity / security model */}
        <section className="grid lg:grid-cols-2 gap-5">

          {/* Recent activity */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.26 }}
            className="rounded-2xl border border-slate-800/90 bg-[#0d1118]/90 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Recent activity
                </p>

                <p className="text-xs text-slate-600 mt-1">
                  Current session
                </p>
              </div>

              <Clock3 className="w-4 h-4 text-slate-600" />
            </div>

            {analysisResult ? (
              <div className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <FileAudio className="w-4 h-4 text-emerald-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">
                      {analysisResult.fileName || 'Audio analysis'}
                    </p>

                    <p className="text-xs text-slate-600 mt-1">
                      Latest voice analysis
                    </p>
                  </div>

                  <div
                    className={`px-2.5 py-1 rounded-full text-[9px] font-semibold tracking-wider ${
                      analysisResult.prediction === 'SPOOF'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {analysisResult.prediction || 'ANALYZED'}
                  </div>
                </div>

                <button
                  onClick={() => navigate('/results')}
                  className="mt-5 text-xs text-slate-500 hover:text-emerald-400 transition-colors"
                >
                  View analysis result →
                </button>
              </div>
            ) : (
              <div className="px-6 py-10 text-center">
                <div className="mx-auto w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <FileAudio className="w-4 h-4 text-slate-600" />
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  No analysis activity yet
                </p>

                <p className="mt-1 text-xs text-slate-700">
                  Your latest detection will appear here.
                </p>
              </div>
            )}
          </motion.div>

          {/* Protection architecture */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.32 }}
            className="rounded-2xl border border-slate-800/90 bg-[#0d1118]/90 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Anahat protection pipeline
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Detection is only the first layer of the defense system.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                ['01', 'Voice detection', 'Identify synthetic speech signals'],
                ['02', 'Risk assessment', 'Determine interaction threat level'],
                ['03', 'Prevention', 'Recommend verification before action'],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="flex items-center gap-4 py-3 border-b border-slate-800/60 last:border-0"
                >
                  <span className="text-[10px] font-mono text-emerald-500/60">
                    {number}
                  </span>

                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-300">
                      {title}
                    </p>

                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {description}
                    </p>
                  </div>

                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <div className="mt-10 pt-5 border-t border-slate-800/60 flex items-center justify-between">
          <p className="text-[9px] uppercase tracking-[0.16em] text-slate-700">
            ANAHAT · Voice Security Intelligence
          </p>

          <p className="text-[9px] uppercase tracking-[0.14em] text-slate-700">
            Detection → Risk → Prevention
          </p>
        </div>
      </div>
    </main>
  );
}