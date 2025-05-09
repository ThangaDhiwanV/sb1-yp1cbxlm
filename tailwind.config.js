/** @type {import('tailwindcss').Config} */
import { theme } from './src/styles/theme';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ...theme.colors,
        // Add alpha colors utility
        alpha: {
          white: {
            5: 'rgb(255 255 255 / 0.05)',
            10: 'rgb(255 255 255 / 0.1)',
            20: 'rgb(255 255 255 / 0.2)',
            30: 'rgb(255 255 255 / 0.3)',
            40: 'rgb(255 255 255 / 0.4)',
            50: 'rgb(255 255 255 / 0.5)',
            60: 'rgb(255 255 255 / 0.6)',
            70: 'rgb(255 255 255 / 0.7)',
            80: 'rgb(255 255 255 / 0.8)',
            90: 'rgb(255 255 255 / 0.9)',
          },
          gray: {
            2: 'rgb(0 0 0 / 0.02)',
            5: 'rgb(0 0 0 / 0.05)',
            10: 'rgb(0 0 0 / 0.1)',
            20: 'rgb(0 0 0 / 0.2)',
            30: 'rgb(0 0 0 / 0.3)',
            40: 'rgb(0 0 0 / 0.4)',
            50: 'rgb(0 0 0 / 0.5)',
            60: 'rgb(0 0 0 / 0.6)',
            70: 'rgb(0 0 0 / 0.7)',
            80: 'rgb(0 0 0 / 0.8)',
            90: 'rgb(0 0 0 / 0.9)',
          },
          accent: {
            10: 'rgb(var(--accent-rgb) / 0.1)',
            20: 'rgb(var(--accent-rgb) / 0.2)',
            30: 'rgb(var(--accent-rgb) / 0.3)',
          },
        }
      },
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      fontWeight: theme.typography.fontWeight,
      lineHeight: theme.typography.lineHeight,
      spacing: theme.spacing,
      boxShadow: theme.boxShadow,
      borderRadius: theme.borderRadius,
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-out': 'fade-out 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
  ],
};