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
        peach: {
          DEFAULT: '#fccfb2',
          50: '#fff4eb',
          100: '#ffe6d3',
          200: '#ffd3b8',
          300: '#ffbe9a',
          400: '#ffab81',
          500: '#fc9c69',
          600: '#e6865a',
          700: '#cc704b',
          800: '#b35b3c',
          900: '#8c4029',
        },
        warmBrown: {
          DEFAULT: '#8e5447',
          50: '#f6ebe9',
          100: '#e9d3ce',
          200: '#d9b5af',
          300: '#c78e84',
          400: '#b46a5f',
          500: '#8e5447',
          600: '#7d473b',
          700: '#6b3d33',
          800: '#5a332b',
          900: '#462520',
        },
        champagne: {
          DEFAULT: '#F7E7D1',
        },
        warmTaupe: {
          DEFAULT: '#C0A896',
        },
        mutedTeal: {
          DEFAULT: '#62929E',
        },
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
