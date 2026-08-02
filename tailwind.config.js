/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Forest pastoral — derived from P1A reference images.
    extend: {
      colors: {
        forest: {
          50: '#F2F7EE',
          100: '#E4EFDB',
          200: '#C9DFB7',
          300: '#A6CC8B',
          400: '#7CB260',
          500: '#5B9742',
          600: '#427831',
          700: '#315C25',
          800: '#23461C',
          900: '#173014',
        },
        cream: {
          50: '#FBF8EF',
          100: '#F5F0E1',
          200: '#ECE4CB',
          300: '#DDD2A8',
        },
        sky: {
          100: '#EAF4FA',
          200: '#CFE6F2',
          300: '#A6D2E8',
          400: '#7BB6D9',
          500: '#5194BF',
          600: '#3C7A9E',
        },
        sun: {
          400: '#F2C94C',
          500: '#E0A92E',
        },
        soil: {
          400: '#A77B4A',
          500: '#855E33',
        },
        leaf: {
          400: '#A6CC8B',
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        leaf: '28px 6px 28px 6px',
        pebble: '24px',
        barn: '20px',
        cloud: '32px',
      },
      boxShadow: {
        soft: '0 6px 0 0 rgba(23, 48, 20, 0.06), 0 12px 24px -8px rgba(23, 48, 20, 0.10)',
        lift: '0 4px 0 0 rgba(23, 48, 20, 0.08), 0 16px 32px -10px rgba(23, 48, 20, 0.14)',
        inset: 'inset 0 0 0 1px rgba(255,255,255,0.6)',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '70%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        grow: {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        sway: {
          '0%,100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        drift: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(14px)' },
          '100%': { transform: 'translateX(0)' },
        },
        flutter: {
          '0%':   { transform: 'translate(0, 0) rotate(0deg)' },
          '25%':  { transform: 'translate(6px, -8px) rotate(6deg)' },
          '50%':  { transform: 'translate(0, -12px) rotate(0deg)' },
          '75%':  { transform: 'translate(-6px, -8px) rotate(-6deg)' },
          '100%': { transform: 'translate(0, 0) rotate(0deg)' },
        },
        bob: {
          '0%,100%': { transform: 'translateY(0) rotate(-3deg)' },
          '50%':     { transform: 'translateY(-5px) rotate(3deg)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        bgIn: {
          from: { opacity: '0', transform: 'scale(1.02)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        floaty: 'floaty 4s ease-in-out infinite',
        wiggle: 'wiggle 1.2s ease-in-out infinite',
        pop: 'pop 360ms cubic-bezier(.22,1.4,.36,1) both',
        grow: 'grow 600ms ease-out both',
        'grow-2': 'grow 800ms ease-out 100ms both',
        'grow-3': 'grow 900ms ease-out 200ms both',
        sway: 'sway 5s ease-in-out infinite',
        'sway-slow': 'sway 7s ease-in-out infinite',
        drift: 'drift 9s ease-in-out infinite',
        flutter: 'flutter 6s ease-in-out infinite',
        bob: 'bob 4.5s ease-in-out infinite',
        'spin-slow': 'spin-slow 36s linear infinite',
      },
    },
  },
  plugins: [],
};
