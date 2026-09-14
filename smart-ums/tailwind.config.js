/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
          accent: 'var(--color-primary-accent)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          light: 'var(--color-secondary-light)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          bg: 'var(--color-success-bg)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          bg: 'var(--color-error-bg)',
          light: 'var(--color-error-light)',
          dark: 'var(--color-error-dark)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          bg: 'var(--color-warning-bg)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          light: 'var(--color-border-light)',
        },
        bg: {
          white: 'var(--color-bg-white)',
          light: 'var(--color-bg-light)',
          selected: 'var(--color-bg-selected)',
          page: 'var(--color-bg-page)',
        },
        accent: {
          purple: 'var(--color-accent-purple)',
          'purple-light': 'var(--color-accent-purple-light)',
          green: 'var(--color-accent-green)',
          'green-light': 'var(--color-accent-green-light)',
        },
        brand: {
          blue: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          border: 'var(--color-border)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
