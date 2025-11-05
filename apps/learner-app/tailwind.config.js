/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#fff5f3',
          100: '#ffe8e3',
          200: '#ffd6cb',
          300: '#ffb8a6',
          400: '#ff8c73',
          500: '#ff7b5c',
          600: '#ed4f25',
          700: '#c8381a',
          800: '#a52e18',
          900: '#88291b',
        },
        salmon: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#ff636f',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        }
      },
      fontFamily: {
        'nunito': ['Nunito', 'system-ui', 'sans-serif'],
        'comic': ['Comic Neue', 'Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'colored': '0 10px 40px -10px rgba(255, 123, 92, 0.25)',
        'colored-lg': '0 20px 50px -10px rgba(255, 123, 92, 0.3)',
        'purple': '0 10px 40px -10px rgba(168, 85, 247, 0.25)',
        'pink': '0 10px 40px -10px rgba(236, 72, 153, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        }
      }
    },
  },
  plugins: [],
}