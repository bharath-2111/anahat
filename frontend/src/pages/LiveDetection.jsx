import React from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import AIAssistant from '../components/AIAssistant';
import { Activity, ShieldAlert, Radio, Clock, AlertCircle, Zap, Bell } from 'lucide-react';

export default function LiveDetection() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100 bg-tech-grid">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-mono font-extrabold tracking-tight text-slate-100 uppercase">
                LIVE VOICE MONITORING
              </h1>
              <span className="text-xs font-mono px-2.5 py-0.5 bg-amber-950/80 border border-amber-800 text-amber-400 font-bold rounded">
                COMING SOON // PROTOTYPE CONCEPT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Conceptual design architecture for real-time streaming audio analysis and continuous call intercept.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-800 px-3 py-1.5 rounded">
            <Clock className="w-4 h-4" />
            <span>STATUS: UNDER ACTIVE DEVELOPMENT</span>
          </div>
        </div>

        {/* Explicit Notice Banner */}
        <div className="bg-slate-900 border-2 border-amber-600/80 rounded-lg p-5 flex items-start space-x-4">
          <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs font-mono leading-relaxed text-slate-300">
            <strong className="text-amber-400 font-bold uppercase block mb-1">
              DEMONSTRATION & ARCHITECTURE CONCEPT ONLY
            </strong>
            Live microphone capture and real-time streaming detection have not been connected to the backend. This screen demonstrates planned future capabilities. Microphone access is intentionally disabled in this release.
          </div>
        </div>

        {/* Conceptual Waveform Display (Static Decorative Vector - No gradients) */}
        <Card
          title="Conceptual Real-time Oscilloscope"
          subtitle="Mock static visualization of low-latency stream buffer"
          headerAction={
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-500 rounded">
              BUFFER: INACTIVE
            </span>
          }
        >
          <div className="bg-slate-950 border border-slate-800 rounded p-6 text-center relative overflow-hidden">
            {/* Decorative Static Waveform Bars (Solid Emerald Green) */}
            <div className="h-28 flex items-center justify-center space-x-1 opacity-40">
              {[15, 30, 45, 20, 60, 80, 40, 95, 70, 35, 50, 90, 65, 25, 40, 75, 85, 30, 50, 90, 45, 20, 60, 75, 30, 15, 40, 60].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-emerald-500 rounded-sm"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xs">
              <div className="w-12 h-12 bg-slate-900 border border-amber-500/60 rounded-full flex items-center justify-center text-amber-400 mb-3">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-base font-mono font-bold text-slate-100 uppercase tracking-widest">
                STREAM ENGINE STANDBY
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-1 max-w-sm">
                WebSockets streaming API endpoint (ws://localhost:8000/ws/stream) will connect here in v3.0 release.
              </p>
            </div>
          </div>
        </Card>

        {/* Future Capability Feature Roadmap Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-slate-950 border border-slate-800 text-emerald-400 rounded">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-mono font-bold text-slate-100 uppercase">
                REAL-TIME VOICE MONITORING
              </h3>
            </div>
            <p className="text-xs font-sans text-slate-400 leading-relaxed">
              Low-latency chunked audio streaming directly from VoIP lines or microphone inputs to FastAPI chunked neural classifiers.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-slate-950 border border-slate-800 text-emerald-400 rounded">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-mono font-bold text-slate-100 uppercase">
                CONTINUOUS SPOOF DETECTION
              </h3>
            </div>
            <p className="text-xs font-sans text-slate-400 leading-relaxed">
              Sliding-window evaluation to detect sudden mid-call voice synthesis or text-to-speech deepfake injection.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-slate-950 border border-slate-800 text-emerald-400 rounded">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-mono font-bold text-slate-100 uppercase">
                LIVE RISK ASSESSMENT
              </h3>
            </div>
            <p className="text-xs font-sans text-slate-400 leading-relaxed">
              Dynamic real-time risk score updating every 500 milliseconds with live spectral confidence telemetry.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-slate-950 border border-slate-800 text-emerald-400 rounded">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-mono font-bold text-slate-100 uppercase">
                INSTANT SECURITY ALERTS
              </h3>
            </div>
            <p className="text-xs font-sans text-slate-400 leading-relaxed">
              Automated popups and webhooks to terminate suspicious calls or request immediate out-of-band operator verification.
            </p>
          </div>

        </div>
      </main>

      <AIAssistant />
    </div>
  );
}
