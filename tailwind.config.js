/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pitch: '#07120f',
        turf: '#16a34a',
        ember: '#f97316',
        court: '#2563eb'
      },
      boxShadow: {
        soft: '0 18px 60px rgba(15, 23, 42, 0.12)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
