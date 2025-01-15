/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./src/**/*.{js,jsx,ts,tsx}", // May need to adjust filepaths

  ],
  theme: {
    extend: {
      colors: {
        'dark-green': '#132A13',
        'hunter-green': '#31572C',
        'fern-green': '#4F772D',
        'moss-green': '#90A955',
        'mindaro': '#ECF39E',
      },
    },
  },
  plugins: [],
}

