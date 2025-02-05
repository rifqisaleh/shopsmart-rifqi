module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/component/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/context/**/*.{js,ts,jsx,tsx}',
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
        customGray: '#e1e1e1', // Custom gray
        softOlive: '#bbbca7', // Previously added
        olive: {
          DEFAULT: '#808000', // Standard olive color
          50: '#F2F2E6',
          100: '#E5E5CC',
          200: '#CCCC99',
          300: '#B2B266',
          400: '#999933',
          500: '#808000', // Main Olive
          600: '#666600',
          700: '#4D4D00',
          800: '#333300',
          900: '#1A1A00',
        },
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
