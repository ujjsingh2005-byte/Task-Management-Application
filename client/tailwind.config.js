/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Foundation: Midnight & Dark Depth
        midnight: {
          deep: '#070B16',
          DEFAULT: '#0B1020',
          surface: '#111827',
          elevated: '#182235',
          slate: '#1E293B',
          graphite: '#334155',
          border: '#273449',
          text: '#F8FAFC',
          muted: '#A7B2C3',
          secondary: '#78889E',
        },
        // Light Foundation: Warm Ivory, Paper, Soft Stone
        ivory: {
          bg: '#FAF8F3',
          paper: '#FFFDF8',
          stone: '#F1EFE8',
          cloud: '#E8EAF0',
          border: '#DDD9CF',
          borderDark: '#CBD6CF',
          text: '#111827',
          muted: '#64748B',
          dim: '#94A3B8',
        },
        // Brand Royal & Electric Violet (Branding, Active Nav, Premium Focus)
        violet: {
          DEFAULT: '#7C5CFC',
          bright: '#8B6CFF',
          deep: '#6042D8',
          soft: 'rgba(124, 92, 252, 0.1)',
          border: 'rgba(124, 92, 252, 0.25)',
        },
        // Aqua (Real-time, Live connection, Collaboration, System Status)
        aqua: {
          DEFAULT: '#22D3EE',
          bright: '#46E7FF',
          deep: '#0891B2',
          soft: 'rgba(34, 211, 238, 0.1)',
          border: 'rgba(34, 211, 238, 0.25)',
        },
        // Coral (Create Task CTA, Urgent items, Critical attention)
        coral: {
          DEFAULT: '#FF6B5E',
          bright: '#FF806F',
          deep: '#E84F43',
          soft: 'rgba(255, 107, 94, 0.1)',
          border: 'rgba(255, 107, 94, 0.25)',
        },
        // Amber (Medium/High priority, Warnings, Deadlines)
        amber: {
          DEFAULT: '#F5B942',
          bright: '#FFC857',
          deep: '#D99419',
          soft: 'rgba(245, 185, 66, 0.1)',
          border: 'rgba(245, 185, 66, 0.25)',
        },
        // Lime (Completed, Positive metrics, Productivity, Velocity)
        lime: {
          DEFAULT: '#A3E635',
          bright: '#BEF264',
          deep: '#65A30D',
          soft: 'rgba(163, 230, 53, 0.1)',
          border: 'rgba(163, 230, 53, 0.25)',
        },
        // Electric Blue (Total tasks, Information, Secondary analytics)
        blueAccent: {
          DEFAULT: '#4F8CFF',
          soft: '#79A7FF',
          deep: '#2563EB',
          surface: 'rgba(79, 140, 255, 0.1)',
          border: 'rgba(79, 140, 255, 0.25)',
        },
        // Rose (Destructive, Errors, Cancelled, Critical status)
        roseAccent: {
          DEFAULT: '#FB7185',
          deep: '#E11D48',
          soft: 'rgba(251, 113, 133, 0.1)',
          border: 'rgba(251, 113, 133, 0.25)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px #273449',
        'soft-light': '0 4px 20px -2px rgba(17, 24, 39, 0.04), 0 0 0 1px #DDD9CF',
        'elevated-dark': '0 12px 36px -4px rgba(0, 0, 0, 0.7), 0 0 0 1px #273449',
        'elevated-light': '0 12px 36px -4px rgba(17, 24, 39, 0.08), 0 0 0 1px #DDD9CF',
        'coral-glow': '0 4px 16px -2px rgba(255, 107, 94, 0.4)',
        'violet-glow': '0 4px 16px -2px rgba(124, 92, 252, 0.35)',
        'aqua-glow': '0 4px 16px -2px rgba(34, 211, 238, 0.35)',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'modal': '20px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseLive: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out forwards',
        'pulse-live': 'pulseLive 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
