/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        momo: {
          yellow: '#FFD700',
          orange: '#FF8C00',
          red: '#FF0000',
          dark: '#1A1A1A',
          light: '#F5F5F5',
          blue: '#0033A0',  
          green: '#00A859',   
          purple: '#800080'  
        }
      }
    },
  },
  plugins: [],
}