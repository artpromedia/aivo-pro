/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#fef7f5',
          100: '#fdeee9',
          200: '#fadbd1',
          300: '#f6c0af',
          400: '#f09b82',
          500: '#ff7b5c',
          600: '#e35a3b',
          700: '#bf4429',
          800: '#9e3825',
          900: '#823225',
          950: '#461710',
        },
        salmon: {
          50: '#fef7f7',
          100: '#fdeced',
          200: '#fadcdc',
          300: '#f6c0c0',
          400: '#f09b9b',
          500: '#ff636f',
          600: '#e5404e',
          700: '#c02d3a',
          800: '#9f2832',
          900: '#84272f',
          950: '#481114',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};