import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import { 
  AlertOctagon, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronRight,
  Lock,
  KeyRound,
  UserCheck,
  Phone,
  Mail,
  FileText,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
} from 'lucide-react';

/**
 * Security Recommendation Card for Page 3 (/results).
 * Displays actionable security protocols based on voice analysis.
 */
export default function RecommendationCard({ recommendation, prediction }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSpoof = prediction === 'Spoof';

  // Action items based on prediction
  const getActionItems = () => {
    if (isSpoof) {
      return [
        { icon: ShieldAlert, text: 'Treat as suspicious - do not proceed with sensitive actions', color: 'text-red-400' },
        { icon: Phone, text: 'Verify through independent trusted channel', color: 'text-yellow-400' },
        { icon: KeyRound, text: 'Request multi-factor identity verification', color: 'text-orange-400' },
        { icon: Lock, text: 'Flag session for security review', color: 'text-red-400' },
      ];
    }
    return [
      { icon: ShieldCheck, text: 'Voice pattern passes synthetic speech thresholds', color: 'text-emerald-400' },
      { icon: UserCheck, text: 'Standard identity verification applies', color: 'text-emerald-400' },
      { icon: CheckCircle2, text: 'No immediate action required', color: 'text-emerald-400' },
      { icon: Info, text: 'Continue with normal security protocols', color: 'text-blue-400' },
    ];
  };

  const actionItems = getActionItems();
  const riskLevel = isSpoof ? 'Critical' : 'Low';
  const severityColor = isSpoof ? 'bg-red-500' : 'bg-emerald-500';

  return (
    <Card
      title="Security Recommendation"
      subtitle="Actionable protocol guidance from threat intelligence engine"
      className="overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 pointer-events-none ${
        isSpoof ? 'bg-gradient-to-br from-red-500/5 to-transparent' : 'bg-gradient-to-br from-emerald-500/5 to-transparent'
      }`} />

      <div className="relative space-y-5">
        {/* Main Recommendation Banner */}
        <motion.div 
          className={`p-5 rounded-xl border-2 ${
            isSpoof
              ? 'bg-red-950/30 border-red-500/30 shadow-lg shadow-red-500/10'
              : 'bg-emerald-950/30 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon */}
            <motion.div 
              className={`p-3 rounded-2xl border-2 flex items-center justify-center ${
                isSpoof
                  ? 'bg-red-950/50 border-red-500/40 text-red-400'
                  : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-400'
              }`}
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              {isSpoof ? (
                <AlertTriangle className="w-7 h-7" />
              ) : (
                <CheckCircle2 className="w-7 h-7" />
              )}
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${
                  isSpoof ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {isSpoof ? '⚠️ Security Alert' : '✅ Authentication Verified'}
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-medium text-slate-500 uppercase tracking-wider">Risk Level</span>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                    isSpoof 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/20' 
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {riskLevel}
                  </span>
                </div>
              </div>
              <p className="mt-1.5 text-sm font-medium text-slate-200 leading-relaxed">
                {recommendation || (isSpoof
                  ? 'Do not trust the caller. Voice pattern contains synthesis anomalies. Request multi-factor identity verification immediately.'
                  : 'Acoustic parameters pass synthetic speech thresholds. Standard identity policy applies.')}
              </p>
            </div>

            {/* Severity indicator */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-medium text-slate-500 uppercase">Severity</span>
                <div className={`w-2 h-2 rounded-full ${severityColor} animate-pulse`} />
              </div>
              <div className={`w-12 h-1 rounded-full mt-1 ${
                isSpoof ? 'bg-red-500/50' : 'bg-emerald-500/50'
              }`}>
                <motion.div 
                  className={`h-full rounded-full ${severityColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: isSpoof ? '100%' : '30%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Recommended Actions
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-[9px] font-medium text-slate-500 hover:text-slate-300 transition-colors"
            >
              {isExpanded ? 'Show less' : 'Show all actions'}
              <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(isExpanded ? actionItems : actionItems.slice(0, 2)).map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-all group"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  <div className={`p-1.5 rounded-lg bg-slate-900/50 border border-slate-800 group-hover:border-${item.color.replace('text-', '')}/20 transition-colors`}>
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-300 leading-relaxed flex-1">
                    {item.text}
                  </span>
                  <ArrowRight className={`w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity ${item.color}`} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer with protocol info */}
        <motion.div 
          className="pt-3 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 text-[9px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-emerald-400" />
              Protocol {isSpoof ? 'V-ALERT-01' : 'V-STD-03'}
            </span>
            <span className="w-px h-3 bg-slate-700" />
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              Encrypted
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-medium text-slate-600 uppercase tracking-wider">
              {isSpoof ? 'High Priority' : 'Normal Priority'}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${isSpoof ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
          </div>
        </motion.div>

        {/* Info note */}
        {isSpoof && (
          <motion.div 
            className="flex items-center gap-2 p-2.5 rounded-lg bg-yellow-500/5 border border-yellow-500/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[9px] font-medium text-yellow-400/80">
              This alert requires immediate attention. Review with security team.
            </span>
          </motion.div>
        )}
      </div>
    </Card>
  );
}