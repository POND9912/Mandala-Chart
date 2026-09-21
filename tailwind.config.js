/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF7EF',
        surface: '#FFFFFF',
        ink: '#3A2E2A',
        muted: '#A08F86',
        faint: '#C9BEB4',
        line: '#F0E9DE',
        chip: '#F3EEE6',
        coral: {
          DEFAULT: '#FF7A59',
          dark: '#C7602F',
        },
        mint: {
          DEFAULT: '#4FD1A5',
          light: '#D8F3E7',
        },
        lavender: {
          DEFAULT: '#B8A9FF',
          dark: '#5B4FA8',
          text: '#8A7BC9',
          bg: '#F1ECFF',
          bg2: '#EDE7FF',
        },
        peach: '#FFD9CC',
      },
      fontFamily: {
        display: ['var(--font-fredoka)', 'sans-serif'],
        body: ['var(--font-quicksand)', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 6px 14px rgba(58,46,42,0.06)',
        softLg: '0 10px 24px rgba(58,46,42,0.07)',
        coral: '0 8px 18px rgba(255,122,89,0.35)',
        lavenderGlow: '0 8px 18px rgba(184,169,255,0.35)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,122,89,0.35)' },
          '50%': { boxShadow: '0 0 0 6px rgba(255,122,89,0)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 2.2s ease-in-out infinite',
        floaty: 'floaty 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
