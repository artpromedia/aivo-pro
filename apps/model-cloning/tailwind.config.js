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
          50: '#FFF5F3',
          100: '#FFE6E1',
          200: '#FFCDC3',
          300: '#FFB4A5',
          400: '#FF9B87',
          500: '#FF7B5C',
          600: '#FF6347',
          700: '#E6442D',
          800: '#CC2C1A',
          900: '#B31E10',
        },
        salmon: {
          50: '#FFF5F5',
          100: '#FFE0E3',
          200: '#FFC1C7',
          300: '#FFA2AB',
          400: '#FF838F',
          500: '#FF636F',
          600: '#FF4456',
          700: '#E6253D',
          800: '#CC102A',
          900: '#B3001F',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
