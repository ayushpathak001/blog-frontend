export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#1f6feb', dark: '#1553c0', light: '#eaf2ff' },
        navy: '#0b1b3f',
        canvas: '#f4f8ff',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: { card: '0 4px 24px -6px rgba(11,27,63,.12)' },
    },
  },
  plugins: [],
};
