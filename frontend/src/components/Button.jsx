import React from 'react';

/**
 * Reusable Button Component following strict static color rules (No Gradients)
 */
export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  className = '',
  icon: Icon,
  fullWidth = false,
}) {
  const baseStyles = 'inline-flex items-center justify-center font-mono font-medium tracking-wide transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base font-bold',
  };

  const variantStyles = {
    primary: 'bg-emerald-700 hover:bg-emerald-600 text-slate-50 border border-emerald-600 shadow-md active:bg-emerald-800',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:bg-slate-900',
    danger: 'bg-red-700 hover:bg-red-600 text-slate-50 border border-red-600 shadow-md active:bg-red-800',
    success: 'bg-emerald-700 hover:bg-emerald-600 text-slate-50 border border-emerald-600 shadow-md active:bg-emerald-800',
    outline: 'bg-transparent hover:bg-slate-800 text-slate-300 border border-slate-700 active:bg-slate-900',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
    >
      {Icon && <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />}
      <span>{children}</span>
    </button>
  );
}
