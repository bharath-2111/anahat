import React from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import Navbar from '../components/Navbar';
import AudioUploader from '../components/AudioUploader';
import PredictionCard from '../components/PredictionCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import AIAssistant from '../components/AIAssistant';
import Card from '../components/Card';
import { FileAudio, ShieldAlert, Zap, Server } from 'lucide-react';

export default function Analyze() {
  const {
    analysisStatus,
    analysisResult,
    error,
    runAnalysis,
    clearSelectedFile,
  } = useAnalysis();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100 bg-tech-grid">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-mono font-extrabold tracking-tight text-slate-100 uppercase">
                VOICE SIGNAL ANALYZER
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 bg-slate-900 border border-slate-800 text-emerald-400 rounded">
                PAGE 02
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Upload target audio to evaluate synthetic voice cloning and deepfake spoofing probability.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>MODEL: FASTAPI NET-V4</span>
          </div>
        </div>

        {/* Dynamic Workflow States */}
        {analysisStatus === 'processing' ? (
          <LoadingState />
        ) : analysisStatus === 'error' ? (
          <ErrorState error={error} onRetry={runAnalysis} />
        ) : analysisStatus === 'success' && analysisResult ? (
          /* Success State: Show ONLY the Primary Result (Section 12) */
          <PredictionCard result={analysisResult} onReset={clearSelectedFile} />
        ) : (
          /* Default / Selected State: Audio Uploader Dropzone */
          <div className="space-y-6">
            <Card
              title="Acoustic Audio Payload Upload"
              subtitle="Drop audio recording file for neural classification"
            >
              <AudioUploader />
            </Card>

            {/* Quick System Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded text-left">
                <div className="flex items-center space-x-2 text-emerald-400 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase">FASTAPI INTEGRATED</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Direct multipart endpoint integration configured via VITE_API_BASE_URL.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded text-left">
                <div className="flex items-center space-x-2 text-amber-400 mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase">NO FABRICATED DATA</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Predictions come strictly from backend neural classification outputs.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded text-left">
                <div className="flex items-center space-x-2 text-emerald-400 mb-1">
                  <FileAudio className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase">MULTI-FORMAT PCM</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Supports WAV, MP3, M4A, and FLAC audio containers up to 50MB.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Embedded Contextual AI Assistant */}
      <AIAssistant />
    </div>
  );
}
