/** @type {import('tailwindcss').Config} */
export default {
  // Classes are also toggled from client-side JS, so scan it too
  content: ['./src/**/*.{astro,html,js,ts}', './public/js/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          pink: '#EC4899',
          dark: '#0B0F19',
          card: '#131B2E',
          border: '#1F293D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
