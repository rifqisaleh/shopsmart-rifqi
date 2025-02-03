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
          DEFAULT: '#37474F', // Deep charcoal as the default shade
          50: '#F4F6F7', // Lighter gray
          100: '#E8EBEC',
          200: '#CFD8DC', // Soft gray
          300: '#B0BEC5',
          400: '#78909C',
          500: '#37474F', // Main color
          600: '#2E3B41',
          700: '#263034',
          800: '#1D2428',
          900: '#121718', // Darkest shade
        },
      },
    },
  },
  plugins: [],
};
