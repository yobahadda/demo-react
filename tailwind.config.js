/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3B82F6', // blue-500
        'secondary': '#8B5CF6', // purple-500
      },
    },
  },
  plugins: [],
}

