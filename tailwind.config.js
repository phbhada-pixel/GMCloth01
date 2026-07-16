/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f4f8f4',
          100: '#e5eee6',
          200: '#ceddce',
          300: '#a7c1a8',
          400: '#799d7b',
          500: '#386a20', // Forest Green
          600: '#2e581a',
          700: '#244514',
          800: '#1a320e',
          950: '#0d1907',
        },
        zari: {
          50: '#fbf9eb',
          100: '#f5f0ce',
          200: '#ebdca0',
          300: '#ddc166',
          400: '#cfa338',
          500: '#b58900', // Zari Gold
          600: '#9b6c16',
          700: '#7b4e14',
          850: '#4c2e0f',
        }
      }
    },
  },
  plugins: [],
}
