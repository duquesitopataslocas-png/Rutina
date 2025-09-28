/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFE66D',
        background: '#F7F9FC',
        surface: '#FFFFFF'
      }
    }
  },
  plugins: []
};
