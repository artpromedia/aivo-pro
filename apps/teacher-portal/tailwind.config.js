/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#FFF1EC',
          100: '#FFE1D6',
          200: '#FFC3B3',
          300: '#FFA18A',
          400: '#FF8C70',
          500: '#FF7B5C',
          600: '#E86A4F',
          700: '#C0503D',
          800: '#8F372B',
          900: '#66261D',
        },
        salmon: {
          50: '#FFEFF1',
          100: '#FFDDE1',
          200: '#FFBAC3',
          300: '#FF98A6',
          400: '#FF7B8D',
          500: '#FF636F',
          600: '#E3525F',
          700: '#B43D49',
          800: '#832C35',
          900: '#5A1F25',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        coral: '0 10px 30px -10px rgba(255, 123, 92, 0.55)',
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};