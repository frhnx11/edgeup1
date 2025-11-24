/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#094d88',    // Deep blue
          secondary: '#10ac8b',  // Teal
          accent: '#0a7d64',     // Darker teal for accents
          light: '#e6f3ff',      // Light blue
          dark: '#063456'        // Darker blue
        }
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'gradient-brand-vertical': 'linear-gradient(to bottom, var(--tw-gradient-stops))'
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(9, 77, 136, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(9, 77, 136, 0.4)' },
        },
      }
    },
  },
  plugins: [],
  safelist: [
    'from-brand-primary',
    'to-brand-secondary',
    'via-brand-accent',
    'to-brand-dark',
    'bg-brand-primary',
    'text-brand-primary',
    'border-brand-primary',
    'bg-brand-secondary',
    'text-brand-secondary',
    'border-brand-secondary',
    'bg-brand-accent',
    'text-brand-accent',
    'border-brand-accent',
    'bg-brand-dark',
    'text-brand-dark',
    'border-brand-dark',
    'bg-brand-light',
    'text-brand-light',
    'border-brand-light'
  ]
};
