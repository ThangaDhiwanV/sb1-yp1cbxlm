/** @type {import('tailwindcss').Config} */
import { theme } from './src/styles/theme';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: theme.colors,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      lineHeight: theme.typography.lineHeight,
      boxShadow: theme.boxShadow,
      borderRadius: theme.borderRadius,
    },
  },
  plugins: [],
};