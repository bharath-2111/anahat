import React from 'react';
import Card from './Card';
import { FileText, HardDrive, Clock, FileCheck } from 'lucide-react';

export default function AudioInfo({ audioInfo }) {
  if (!audioInfo) return null;

  const items = [
    { label: 'FILENAME', value: audioInfo.filename, icon: FileText },
    { label: 'FILE FORMAT', value: audioInfo.fileType, icon: FileCheck },
    { label: 'FILE SIZE', value: audioInfo.fileSize, icon: HardDrive },
    { label: 'RECORDING LENGTH', value: audioInfo.duration, icon: Clock }
  ];

  return (
    <Card title="Target Audio Information" subtitle="File properties and acoustic encoding metadata">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded flex items-center space-x-3">
              <div className="p-2 bg-slate-900 border border-slate-800 rounded text-emerald-400">
                <Icon className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">{item.label}</span>
                <span className="text-xs font-mono font-semibold text-slate-200 truncate block">
                  {item.value || 'N/A'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
