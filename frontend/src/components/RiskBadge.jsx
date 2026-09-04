import React from 'react';
import { AlertOctagon, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';

/**
 * RiskBadge Component
 * Displays Risk Level (LOW, MEDIUM, HIGH, CRITICAL) using solid colors & text labels.
 */
export default function RiskBadge({ level = 'Low', size = 'md' }) {
  const normalized = (level || 'Low').toString().toUpperCase();

  let config = {
    bg: 'bg-emerald-950/80',
    text: 'text-emerald-400',
    border: 'border-emerald-800',
    icon: ShieldCheck,
    label: 'LOW RISK'
  };

  if (normalized.includes('CRIT')) {
    config = {
      bg: 'bg-red-950',
      text: 'text-red-400',
      border: 'border-red-700',
      icon: AlertOctagon,
      label: 'CRITICAL RISK'
    };
  } else if (normalized.includes('HIGH')) {
    config = {
      bg: 'bg-red-900/60',
      text: 'text-red-300',
      border: 'border-red-800',
      icon: ShieldAlert,
      label: 'HIGH RISK'
    };
  } else if (normalized.includes('MED')) {
    config = {
      bg: 'bg-amber-950/80',
      text: 'text-amber-400',
      border: 'border-amber-800',
      icon: AlertTriangle,
      label: 'MEDIUM RISK'
    };
  }

  const Icon = config.icon;

  const sizeClasses = size === 'lg' 
    ? 'px-3.5 py-1.5 text-xs tracking-widest font-bold' 
    : 'px-2.5 py-1 text-[11px] font-semibold';

  return (
    <span className={`inline-flex items-center space-x-1.5 font-mono border rounded ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}>
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
}
