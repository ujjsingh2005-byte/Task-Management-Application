import React from 'react';
import { STATUS_CONFIG, TASK_STATUS } from '../../utils/constants';

export const StatusPill = ({ status, onChange, disabled = false, isInteractive = false }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.TODO;

  if (!isInteractive || !onChange) {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold border ${config.badge}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${config.dot}`} />
        <span>{config.label}</span>
      </span>
    );
  }

  return (
    <select
      value={status}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`text-[10px] sm:text-[11px] font-semibold rounded-lg px-2 py-0.5 border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet/30 bg-ivory-paper dark:bg-midnight-ink ${config.badge}`}
    >
      {Object.entries(TASK_STATUS).map(([key, value]) => (
        <option key={key} value={value} className="bg-ivory-paper dark:bg-midnight-ink text-ivory-text dark:text-midnight-text">
          {STATUS_CONFIG[value]?.label || value}
        </option>
      ))}
    </select>
  );
};
