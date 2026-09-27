/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F3F6FB',
        surface: '#FFFFFF',
        ink: '#1B2A4A',
        muted: '#6B7A99',
        faint: '#A9B6CC',
        line: '#E2E8F2',
        chip: '#EDF2F9',
        // Primary brand blue (TTT-style navy → royal blue)
        coral: {
          DEFAULT: '#0B5CB8',
          dark: '#0A3D91',
        },
        mint: {
          DEFAULT: '#22B07D',
          light: '#D9F2E7',
        },
        lavender: {
          // Secondary sky blue (logo accent)
          DEFAULT: '#1E9BE8',
          dark: '#0A3D91',
          text: '#1478C8',
          bg: '#E7F3FD',
          bg2: '#DCEDFB',
        },
        peach: '#CFE3F8',
      },
      backgroundImage: {
        brand: 'linear-gradient(90deg, #0A3D91 0%, #0B5CB8 100%)',
      },
      fontFamily: {
        display: ['var(--font-fredoka)', 'sans-serif'],
        body: ['var(--font-quicksand)', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 6px 14px rgba(16,42,90,0.07)',
        softLg: '0 10px 24px rgba(16,42,90,0.09)',
        coral: '0 8px 18px rgba(11,92,184,0.30)',
        lavenderGlow: '0 8px 18px rgba(30,155,232,0.30)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,255,255,0.45)' },
          '50%': { boxShadow: '0 0 0 6px rgba(255,255,255,0)' },
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
