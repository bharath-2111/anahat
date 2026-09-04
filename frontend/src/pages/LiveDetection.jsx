import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import AIAssistant from '../components/AIAssistant';
import { 
  Activity, 
  ShieldAlert, 
  Radio, 
  Clock, 
  AlertCircle, 
  Zap, 
  Bell,
  Mic,
  Shield,
  Lock,
  Server,
  Database,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Signal,
  Wifi,
  Bluetooth,
  Phone,
  Headphones,
  RadioReceiver,
  Scan,
  Fingerprint,
  Sparkles,
  Gauge,
  Target,
  Brain,
} from 'lucide-react';

export default function LiveDetection() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('idle'); // idle, connecting, connected, error
  const [progress, setProgress] = useState(0);

  // Simulate connection process
  const handleConnect = () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setConnectionStatus('connected');
          setIsConnecting(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Simulate connection failure after 5 seconds if not connected
    setTimeout(() => {
      if (connectionStatus !== 'connected') {
        clearInterval(interval);
        setConnectionStatus('error');
        setIsConnecting(false);
      }
    }, 6000);
  };

  const handleReset = () => {
    setConnectionStatus('idle');
    setProgress(0);
    setIsConnecting(false);
  };

  // Feature cards data
  const features = [
    {
      icon: Mic,
      title: 'Real-time Voice Monitoring',
      description: 'Low-latency chunked audio streaming from VoIP lines or microphone inputs to neural classifiers.',
      color: 'emerald',
      status: 'planned',
    },
    {
      icon: ShieldAlert,
      title: 'Continuous Spoof Detection',
      description: 'Sliding-window evaluation to detect mid-call voice synthesis or deepfake injection.',
      color: 'red',
      status: 'planned',
    },
    {
      icon: Gauge,
      title: 'Live Risk Assessment',
      description: 'Dynamic real-time risk score updating every 500ms with spectral confidence telemetry.',
      color: 'blue',
      status: 'planned',
    },
    {
      icon: Bell,
      title: 'Instant Security Alerts',
      description: 'Automated popups and webhooks to terminate suspicious calls or request verification.',
      color: 'purple',
      status: 'planned',
    },
  ];

  // Connection status indicators
  const statusConfig = {
    idle: { label: 'Disconnected', color: 'text-slate-500', icon: XCircle, bg: 'bg-slate-800/30 border-slate-700' },
    connecting: { label: 'Connecting...', color: 'text-yellow-400', icon: Loader2, bg: 'bg-yellow-500/10 border-yellow-500/30' },
    connected: { label: 'Connected', color: 'text-emerald-400', icon: CheckCircle2, bg: 'bg-emerald-500/10 border-emerald-500/30' },
    error: { label: 'Connection Failed', color: 'text-red-400', icon: XCircle, bg: 'bg-red-500/10 border-red-500/30' },
  };

  const currentStatus = statusConfig[connectionStatus];
  const StatusIcon = currentStatus.icon;

  // System metrics
  const systemMetrics = [
    { label: 'Stream Status', value: connectionStatus === 'connected' ? 'Active' : 'Standby', icon: Signal },
    { label: 'Latency', value: connectionStatus === 'connected' ? '42ms' : '--', icon: Zap },
    { label: 'Buffer', value: connectionStatus === 'connected' ? '98%' : '0%', icon: Database },
    { label: 'Channels', value: connectionStatus === 'connected' ? '2' : '0', icon: Radio },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/[0.02] blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/[0.015] blur-3xl" />
      </div>

      <Navbar />

      <main className="relative max-w-6xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Header */}
        <motion.div 
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                Live Voice Monitoring
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time streaming audio analysis and continuous call interception architecture
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
              <Clock className="w-3.5 h-3.5" />
              <span>Status: Under Development</span>
            </div>
          </div>
        </motion.div>

        {/* Notice Banner */}
        <motion.div 
          className="bg-slate-900/70 border-2 border-amber-500/30 rounded-2xl p-5 flex items-start gap-4 shadow-lg shadow-amber-500/5"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-xs leading-relaxed text-slate-300">
            <strong className="text-amber-400 font-bold uppercase block mb-1">
              Demonstration & Architecture Concept Only
            </strong>
            Live microphone capture and real-time streaming detection have not been connected to the backend. This screen demonstrates planned future capabilities. Microphone access is intentionally disabled in this release.
          </div>
        </motion.div>

        {/* Connection Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card
            title="Stream Connection"
            subtitle="WebSocket streaming API endpoint status"
            className="overflow-hidden"
          >
            <div className="space-y-5">
              {/* Status Display */}
              <div className={`p-5 rounded-xl border-2 transition-all duration-300 ${currentStatus.bg}`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl border-2 ${
                      connectionStatus === 'connected' ? 'border-emerald-500/30 bg-emerald-500/10' :
                      connectionStatus === 'connecting' ? 'border-yellow-500/30 bg-yellow-500/10' :
                      connectionStatus === 'error' ? 'border-red-500/30 bg-red-500/10' :
                      'border-slate-700 bg-slate-800/30'
                    }`}>
                      <StatusIcon className={`w-6 h-6 ${currentStatus.color} ${
                        connectionStatus === 'connecting' ? 'animate-spin' : ''
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${currentStatus.color}`}>
                        {currentStatus.label}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {connectionStatus === 'connected' ? 'WebSocket stream active' :
                         connectionStatus === 'connecting' ? 'Establishing secure connection...' :
                         connectionStatus === 'error' ? 'Connection timeout. Please retry.' :
                         'Ready to connect to stream endpoint'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {connectionStatus === 'connected' && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[8px] font-medium text-emerald-400 uppercase tracking-wider">Live</span>
                      </div>
                    )}
                    
                    {connectionStatus === 'idle' && (
                      <motion.button
                        onClick={handleConnect}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RadioReceiver className="w-4 h-4" />
                        Connect Stream
                      </motion.button>
                    )}

                    {connectionStatus === 'error' && (
                      <motion.button
                        onClick={handleReset}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RefreshCw className="w-4 h-4" />
                        Retry Connection
                      </motion.button>
                    )}

                    {connectionStatus === 'connected' && (
                      <motion.button
                        onClick={handleReset}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <XCircle className="w-4 h-4" />
                        Disconnect
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Progress bar during connection */}
                {connectionStatus === 'connecting' && (
                  <div className="mt-4">
                    <div className="flex justify-between text-[9px] text-slate-500 mb-1">
                      <span>Establishing connection...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* System Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {systemMetrics.map((metric, idx) => {
                  const Icon = metric.icon;
                  const isActive = connectionStatus === 'connected';
                  return (
                    <motion.div
                      key={metric.label}
                      className="bg-slate-950/50 border border-slate-800 rounded-xl p-3"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + idx * 0.05 }}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-600'}`} />
                        <span className="text-[8px] font-medium text-slate-500 uppercase tracking-wider">{metric.label}</span>
                      </div>
                      <p className={`text-sm font-bold mt-1 ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>
                        {metric.value}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Feature Roadmap Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-200">Planned Capabilities</h2>
            </div>
            <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">Roadmap v3.0</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const colorMap = {
                emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                red: 'bg-red-500/10 border-red-500/20 text-red-400',
                blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
              };
              return (
                <motion.div
                  key={feature.title}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl border ${colorMap[feature.color]} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                          {feature.title}
                        </h3>
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[7px] font-bold text-amber-400 uppercase tracking-wider">
                          Planned
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Technical Details */}
        <motion.div
          className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Server className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Technical Architecture</h3>
              <p className="text-[9px] text-slate-500">WebSocket streaming pipeline</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3">
              <span className="text-[8px] font-medium text-slate-500 uppercase tracking-wider">Protocol</span>
              <p className="text-xs font-mono text-slate-300 mt-1">WebSocket (ws://)</p>
            </div>
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3">
              <span className="text-[8px] font-medium text-slate-500 uppercase tracking-wider">Endpoint</span>
              <p className="text-xs font-mono text-slate-300 mt-1">/ws/stream</p>
            </div>
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3">
              <span className="text-[8px] font-medium text-slate-500 uppercase tracking-wider">Format</span>
              <p className="text-xs font-mono text-slate-300 mt-1">JSON / Audio Chunks</p>
            </div>
          </div>
        </motion.div>

      </main>

      <AIAssistant />
    </div>
  );
}