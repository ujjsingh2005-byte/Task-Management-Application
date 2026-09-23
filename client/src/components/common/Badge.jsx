import React from 'react';

export const Badge = ({ children, variant = 'default', className = '', dot = false, dotColor = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor || 'bg-slate-400'}`} />
      )}
      {children}
    </span>
  );
};
