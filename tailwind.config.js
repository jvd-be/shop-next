/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // حتماً باشه
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",        // همه src
    "./app/**/*.{js,jsx,ts,tsx}",        // همه app
    "./components/**/*.{js,jsx,ts,tsx}", // همه components
    "./pages/**/*.{js,jsx,ts,tsx}",      // اگه pages داری
    "./**/*.{js,jsx,ts,tsx}",            // همه چیز (آخرین چاره)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}