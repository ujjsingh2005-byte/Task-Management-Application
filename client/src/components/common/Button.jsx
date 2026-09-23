import React from 'react';

const VARIANTS = {
  primary: 'bg-coral hover:bg-coral-bright text-white shadow-coral-glow border border-coral-deep/30 font-semibold focus:ring-coral/40',
  secondary: 'bg-violet hover:bg-violet-bright text-white shadow-violet-glow border border-violet-deep/30 font-semibold focus:ring-violet/40',
  outline: 'bg-ivory-paper dark:bg-midnight-surface hover:bg-ivory-stone dark:hover:bg-midnight-elevated text-ivory-text dark:text-midnight-text border border-ivory-border dark:border-midnight-border font-medium focus:ring-violet/30',
  live: 'bg-aqua hover:bg-aqua-bright text-midnight-deep shadow-aqua-glow font-bold focus:ring-aqua/40',
  success: 'bg-lime hover:bg-lime-bright text-midnight-deep font-bold focus:ring-lime/40',
  warning: 'bg-amber hover:bg-amber-bright text-midnight-deep font-bold focus:ring-amber/40',
  danger: 'bg-roseAccent hover:bg-roseAccent-deep text-white shadow-sm font-semibold focus:ring-roseAccent/40',
  ghost: 'bg-transparent hover:bg-ivory-stone/60 dark:hover:bg-midnight-elevated/60 text-ivory-muted dark:text-midnight-muted hover:text-ivory-text dark:hover:text-midnight-text font-medium focus:ring-violet/20',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-xl min-h-[32px]',
  md: 'px-4 py-2 text-xs sm:text-sm rounded-xl min-h-[40px]',
  lg: 'px-5 py-2.5 text-sm sm:text-base rounded-2xl min-h-[46px]',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-midnight-deep active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
        VARIANTS[variant] || VARIANTS.primary
      } ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : Icon ? (
        <Icon className={`h-4 w-4 ${children ? 'mr-1.5' : ''}`} />
      ) : null}
      {children}
    </button>
  );
};
