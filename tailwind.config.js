/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nav-dark': '#040D2E',
        'searchbar-dark': '#252E4F',
        'main-gray': '#F8F8FB',
        'footer-gray': '#8C90AB',
        'gradient-start': '#5468FF',
        'gradient-end': '#01D8D0',
        'highlight': '#00DCD1',
        'hover-green': '#00b0a7',
        'hover-light-green':'#19dfd5',
        'ring-green': '#b2f4f1'
      },
    },
    fontFamily: {
      chinese: ['Noto Sans TC', 'sans-serif'],
    },

  },
  plugins: [],
}

