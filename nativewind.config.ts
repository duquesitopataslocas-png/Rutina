import { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#0ea5e9',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#0f172a'
      }
    }
  },
  plugins: []
} satisfies Config;
