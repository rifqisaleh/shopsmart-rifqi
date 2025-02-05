/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}', // Include all pages within src
    './src/component/**/*.{js,ts,jsx,tsx}', // Include all components within src
    './src/app/**/*.{js,ts,jsx,tsx}', // Include app directory (if using app router)
    './src/context/**/*.{js,ts,jsx,tsx}', // Include other directories
    './src/config/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        urbanChic: {
          DEFAULT: '#37474F',
          50: '#F4F6F7',
          100: '#E8EBEC',
          200: '#CFD8DC',
          300: '#B0BEC5',
          400: '#78909C',
          500: '#37474F',
          600: '#2E3B41',
          700: '#263034',
          800: '#1D2428',
          900: '#121718',
        },
        customGray: '#e1e1e1', // Previously added custom gray
        softOlive: '#bbbca7', // New color added
        greenSage: '#B2AC88',
      },
      fontFamily: {
        philosopher: ['Philosopher', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
