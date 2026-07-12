/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 👈 MAKE SURE THIS LINE IS HERE
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    // ... rest of your paths
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}