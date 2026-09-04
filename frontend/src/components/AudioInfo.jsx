import React from 'react';
import {
  FileText,
  HardDrive,
  Clock,
  FileAudio,
} from 'lucide-react';

export default function AudioInfo({ audioInfo }) {
  if (!audioInfo) return null;

  const items = [
    {
      label: 'File name',
      value: audioInfo.filename,
      icon: FileText,
    },
    {
      label: 'Format',
      value: audioInfo.fileType,
      icon: FileAudio,
    },
    {
      label: 'File size',
      value: audioInfo.fileSize,
      icon: HardDrive,
    },
    {
      label: 'Recording length',
      value: audioInfo.duration,
      icon: Clock,
    },
  ];

  return (
    <section>
      {/* Section heading */}
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="text-sm font-medium text-slate-300">
            Recording
          </h2>

          <p className="mt-1 text-xs text-slate-600">
            Details about the audio that was analyzed.
          </p>
        </div>

        <FileAudio className="w-4 h-4 text-slate-700" />
      </div>

      {/* Information */}
      <div className="border-y border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2">

          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className={`
                  flex items-center gap-4 py-5
                  ${index % 2 === 0 ? 'sm:pr-8' : 'sm:pl-8'}
                  ${index < 2 ? 'border-b border-slate-800' : ''}
                  ${index % 2 === 1 ? 'sm:border-l sm:border-slate-800' : ''}
                `}
              >
                <div className="w-9 h-9 shrink-0 border border-slate-800 bg-[#0b0e14] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-slate-500" />
                </div>

                <div className="min-w-0">
                  <div className="text-[10px] text-slate-600 tracking-wide">
                    {item.label}
                  </div>

                  <div className="mt-1 text-sm font-medium text-slate-300 truncate">
                    {item.value || 'Not available'}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}