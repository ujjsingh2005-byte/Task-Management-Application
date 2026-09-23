import React from 'react';

export const TaskFlowLogo = ({ size = 'md', variant = 'default', showText = true }) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', svg: 'w-4 h-4', text: 'text-base' },
    md: { icon: 'w-9 h-9', svg: 'w-5 h-5', text: 'text-lg' },
    lg: { icon: 'w-11 h-11', svg: 'w-6 h-6', text: 'text-2xl' },
    xl: { icon: 'w-14 h-14', svg: 'w-8 h-8', text: 'text-3xl' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center space-x-2.5 select-none group">
      {/* Geometric "T" + Forward Momentum Arrow */}
      <div
        className={`${currentSize.icon} rounded-xl bg-midnight border border-violet/30 flex items-center justify-center shadow-md shadow-midnight-deep/40 shrink-0 transition-transform duration-200 group-hover:scale-105 relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-violet/20 via-transparent to-aqua/20 pointer-events-none" />
        <svg
          className={`${currentSize.svg} relative z-10`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top T-bar with subtle Violet gradient */}
          <path
            d="M4 6H20"
            stroke="#7C5CFC"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Dynamic Forward Momentum Arrow Vector (Aqua) */}
          <path
            d="M12 6V18M12 18L18 12M12 18L6 12"
            stroke="#22D3EE"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Coral Momentum Spark */}
          <circle cx="18" cy="12" r="1.5" fill="#FF6B5E" />
        </svg>
      </div>

      {showText && (
        <div className="leading-tight">
          <span className={`font-black tracking-tight text-ivory-text dark:text-midnight-text ${currentSize.text}`}>
            TASK<span className="text-violet font-extrabold">FLOW</span>
          </span>
        </div>
      )}
    </div>
  );
};
