/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#59C8C0',
          softBg: '#E8FAF6',
          primary: '#16B8AC',
          primaryHover: '#109F95',
          content: '#F8F9FB',
          darkText: '#151923',
          mutedText: '#757B86',
          border: '#E6E8EC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};