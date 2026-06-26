/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1a2b4a', // primary dark text / headers
        accent: '#2563eb', // links, primary buttons
        deadline: '#f59e0b', // amber for time-sensitive deadline/notice boxes
        warnbanner: '#fef3c7', // yellow law-update banner background
        panel: '#f3f4f6', // light gray aside panels
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      maxWidth: {
        prose: '46rem',
      },
    },
  },
  plugins: [],
};
