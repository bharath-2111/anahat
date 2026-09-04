import React from 'react';

/**
 * Solid Dark Card Container (No gradients, crisp borders)
 */
export default function Card({ children, className = '', title, subtitle, headerAction }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-xl ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            {title && (
              <h3 className="text-sm font-mono font-bold tracking-wider text-slate-100 uppercase">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
