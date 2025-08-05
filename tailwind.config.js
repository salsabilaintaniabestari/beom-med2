/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'dark-bg': '#0F172A',
        'dark-card': '#1E293B',
        'dark-primary': '#FFFFFF',
        'dark-secondary': '#94A3B8',
        'dark-positive': '#22C55E',
        'dark-negative': '#EF4444',
        'dark-cta': '#3B82F6',
        'dark-tag': '#334155',
        'dark-hover': '#1E2535',
        'dark-table-hover': '#1C2A3A',
        'dark-color': '#374151',
        
        // AI8 brand colors
        'ai8-navy': '#1E293B',
        'ai8-neon': '#00D9FF',
        'ai8-white': '#FFFFFF',
        'ai8-light': '#F8FAFC',
        'ai8-gray': '#64748B',
        'ai8-success': '#22C55E',
        'ai8-warning': '#F59E0B',
        'ai8-error': '#EF4444',
        
        // Mint colors for accents
        'mint': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}