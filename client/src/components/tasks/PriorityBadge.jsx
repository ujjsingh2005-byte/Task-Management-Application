import React from 'react';
import { PRIORITY_CONFIG } from '../../utils/constants';

export const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase ${config.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
