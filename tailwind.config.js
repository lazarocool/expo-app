/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: [
      "./App.{js,jsx,ts,tsx}",
      "./src/**/*.{js,jsx,ts,tsx}",
      "./global.css",
      "./src/styles/tailwind.css"
    ],
  },
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#3E88FF',
        secondary: '#333333',
        accent: '#555555',
        success: '#4CAF50',
        danger: '#F44336',
        background: '#FFFFFF',
        card: '#F5F5F5',
      },
    },
  },
}

